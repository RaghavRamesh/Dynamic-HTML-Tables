function addColumns(tbl, interval, options) {
	// Appends further columns to the table

	var tableHeadObject = tbl.tHead;
	var firstRowTH = document.createElement('th');
	firstRowTH.setAttribute('colspan', 5);
	if (interval == "week") {
		firstRowTH.innerHTML = "Period: " + options.startDate + " - " + options.endDate;
	} else if (interval == "month") {
		firstRowTH.innerHTML = "Period: " + options.monthName + ", " + options.startDate + " - " + options.endDate;
	} else if (interval == "year") {
		firstRowTH.innerHTML = "Period: " + options.year + ", " + options.startDate + " - " + options.endDate;
	}
	tableHeadObject.rows[0].appendChild(firstRowTH);

	var subRow1TH = document.createElement('th');
	subRow1TH.innerHTML = "Chargeable";
	tableHeadObject.rows[1].appendChild(subRow1TH);	
	addRows(tbl);

	var subRow2TH = document.createElement('th');
	subRow2TH.innerHTML = "Non-Chargeable";
	tableHeadObject.rows[1].appendChild(subRow2TH);	
	addRows(tbl);

	var subRow3TH = document.createElement('th');
	subRow3TH.innerHTML = "Non-Available";
	tableHeadObject.rows[1].appendChild(subRow3TH);	
	addRows(tbl);

	var subRow4TH = document.createElement('th');
	subRow4TH.innerHTML = "Total";
	tableHeadObject.rows[1].appendChild(subRow4TH);	
	addRows(tbl);

	var subRow5TH = document.createElement('th');
	subRow5TH.innerHTML = "Utilisation";
	tableHeadObject.rows[1].appendChild(subRow5TH);	
	addRows(tbl);
}

function addRows(tbl) {
	// Adds cells and test values for the respective columns

	var tableBodyObject = tbl.tBodies[0];
	for (var i = 0; i < tableBodyObject.rows.length; i++) {
		var newCell = tableBodyObject.rows[i].insertCell(-1);
		newCell.innerHTML = 'testing' +  i;
	}
}

function convertDateToString(date) {
	// Converts date to string

	var newDate = new Date(date);
	var dd = newDate.getDate();
	var mm = newDate.getMonth() + 1;
	var yy = newDate.getFullYear();
	newDate = yy + "-" + mm + "-" + dd;
	return newDate;
}

function convertToDate(date) {
	// Converts string to Date() object

	date = date.toString().split("-");
	return new Date(date[0], date[1] - 1, date[2]);
} 

function dateStringToUTC(dateString) {
	// Converts date string to UTC format

	var dateStringArray = dateString.split("-");
	var yy = parseInt(dateStringArray[0], 10);
	var mm = parseInt(dateStringArray[1], 10) - 1;
	var dd = parseInt(dateStringArray[2], 10);
	return Date.UTC(yy, mm, dd, 0, 0, 0);
}

function getDayOfYear(date) {
	// Returns the day number of the date of that year

	var firstJan = new Date(date.getFullYear(), 0, 1);
	var dayNumber = date - firstJan;
	return dayNumber/86400000;
}

function getDifferenceInMonths(fromDate, toDate) {
	// Calculates the difference in months given the start and end date
	
	var differenceInMonths = 0;
	while (fromDate <= toDate) {
		differenceInMonths++;
		var daysInMonth = fromDate.getDaysInMonth();
		fromDate = setDateOffset(fromDate, daysInMonth);	
	}
	return differenceInMonths;
}

function getDifferenceInWeeks(fromDate, toDate) {
	// Calculates the difference in weeks given the start and end date

	var d1 = dateStringToUTC(fromDate);
	var d2 = dateStringToUTC(toDate);
	var oneweek = 86400000 * 7;
	return Math.ceil((d2 - d1) / oneweek);
}

function getDifferenceInYears(fromDate, toDate) {
	// Calculates the difference in years given the start and the end date

	var difference = 1;
	difference += toDate.getFullYear() - fromDate.getFullYear();
	return difference;
}

function getMonthName(date) {
	// Returns the month name of the date in string format

	var monthNames = ["January", "February", "March", "April", "May", "June",
    	"July", "August", "September", "October", "November", "December"];
    return monthNames[date.getMonth()];
}

function getRemainingDaysInWeek(beginningDate) {
	// Returns the number of days left in the week, given a date 

	var day = beginningDate.getDay();
	return 6 - day;
}

function getRemainingDaysInYear(beginningDate) {
	// Returns the remaining days in the year given the beginning date

	var numberOfDaysInYear = beginningDate.isLeapYear() ? 366 : 365;
	var remainingDaysInYear = numberOfDaysInYear - getDayOfYear(beginningDate);
	return remainingDaysInYear;
}

function setDateOffset(date, offset) {
	// Returns the date after adding the offset
	
	var newDate = new Date(date);
	newDate.setDate(newDate.getDate() + offset);
	return newDate;
}

// ------------------------------------------------------------------------------------------
function resetTable(tbl)
{
	// Resets the table after submit

	// Delete Period
	while (tbl.rows[0].cells.length > 2) {
		tbl.rows[0].deleteCell(-1);	
	}
	
	// Delete the 5 sub headings
	while (tbl.rows[1].cells.length > 0) {
		for (var i = 0; i < 5; i++) {
			tbl.rows[1].deleteCell(-1);
		}	
	}
		
	// Delete the rows below the 5 columns
	for (var rowNumber = 2; rowNumber < tbl.rows.length; rowNumber++) {
		while (tbl.rows[rowNumber].cells.length > 2) {
			tbl.rows[rowNumber].deleteCell(-1);
		}
	}
}

function changeTableLook(tbl, interval) {
	// Main function that updates the look of the table

	// Reset table after submit
	resetTable(tbl);
	
	var iDateFromInput = document.getElementById('dateFromInput').value;
	var iDateToInput = document.getElementById('dateToInput').value;
	
	// If the chosen interval is week
	if (interval == "week") {
		/** 
		 * Calculate weeks between the interval of dates
         *
		 * - Calculate remaining days of that week
		 * - Include the above week in calculating the difference
		 * - Update new start date to the Sunday of next week
		 * - Calculate difference in weeks for the remaining days (if any)
		 */

		var dStartDate = convertToDate(iDateFromInput);
		var numberOfRemainingDays = getRemainingDaysInWeek(dStartDate);
		var dNewStartDate = setDateOffset(dStartDate, numberOfRemainingDays + 1);
		var sNewStartDate = convertDateToString(dNewStartDate);
		
		var differenceInWeeks = 1 + getDifferenceInWeeks(sNewStartDate, iDateToInput);

		/** 
		 * Calculate period
         *
	 	 * - Obtain date intervals
		 * - Convert them to JS Date type
		 * - Calculate offset till end of the first week
		 * - Calculate end date of the week
		 * - Check if the end of the interval input is greater than the date calculated 
		 * after offset
		 * - Send the period values as parameters to addColumns() and calculate subsequent 
		 * intervals by adding 1 and 7 to the previous end date until the toDate is 
		 * smaller than the calc date
		 */
		
		var dFromDate = convertToDate(iDateFromInput);
		var dToDate = convertToDate(iDateToInput);
		
		var remainingDaysInWeek = getRemainingDaysInWeek(dFromDate);
		
		var dEndDateOfWeek = setDateOffset(dFromDate, remainingDaysInWeek);
		
		dEndDateOfWeek = (dEndDateOfWeek > dToDate) ? dToDate : dEndDateOfWeek;

		var sStartDateOfWeek = convertDateToString(dFromDate);
		var sEndDateOfWeek = convertDateToString(dEndDateOfWeek);
		
		// Add as many additional columns as number of weeks
		for (var i = 0; i < differenceInWeeks; i++) {
			var options = {
				'startDate': sStartDateOfWeek,
				'endDate': sEndDateOfWeek
			};
			addColumns(tbl, interval, options);	
			
			// Update the start and end of next week
			dStartDateOfWeek = setDateOffset(sEndDateOfWeek, 1);
			dEndDateOfWeek = setDateOffset(dStartDateOfWeek, 6);
			dEndDateOfWeek = (dEndDateOfWeek > dToDate) ? dToDate : dEndDateOfWeek;
			sStartDateOfWeek = convertDateToString(dStartDateOfWeek);
			sEndDateOfWeek = convertDateToString(dEndDateOfWeek);
		}
	} else if (interval == "month") {
		/** 
		 * Calculate months between the interval of dates
		 * 
		 * - get remaining number of days in the first month
		 * - include that in differenceInMonths
		 * - update the new date
		 * - calculate the difference in months (if any)
		 */

		var dFromDate = convertToDate(iDateFromInput);
		var dToDate = convertToDate(iDateToInput);

		var differenceInMonths = 0;
		var daysInMonth = dFromDate.getDaysInMonth();
		var remainingDaysInMonth = daysInMonth - dFromDate.getDate();
		var differenceInMonths = differenceInMonths + 1;
		var dNewStartDate = setDateOffset(dFromDate, remainingDaysInMonth + 1);

		differenceInMonths = differenceInMonths + getDifferenceInMonths(dNewStartDate, dToDate);

		/** 
		 * Calculate period 		
		 */
		var dStartDate = dFromDate; 
		var dEndDate = setDateOffset(dStartDate, remainingDaysInMonth);
		var sStartDate = convertDateToString(dStartDate);
		var sEndDate = convertDateToString(dEndDate);

		/** 
		 * Call addColumns based on the number of months
		 */
		for (var i = 0; i < differenceInMonths; i++) {
			var options = {
				'monthName': getMonthName(dStartDate),
				'startDate': sStartDate,
				'endDate': sEndDate
			};
			addColumns(tbl, interval, options);

			// Update the start and end of the next month
			dStartDate = setDateOffset(dEndDate, 1);
			var daysInMonth = dStartDate.getDaysInMonth();
			dEndDate = setDateOffset(dStartDate, daysInMonth - 1);
			dEndDate = (dEndDate > dToDate) ? dToDate : dEndDate;
			sStartDate = convertDateToString(dStartDate);
			sEndDate = convertDateToString(dEndDate);
		} 
	} else if (interval == "year") {

	}
} 

var submit = function() {
	// Calls the function that updates the look of the table when the submit 
	// button is pressed after input validation
	
	var fromDate = document.getElementById('dateFromInput').value;
	var toDate = document.getElementById('dateToInput').value;
	if (fromDate > toDate) {
		return;
	}

	var tbl = document.getElementById("mytable");
	var interval = document.getElementById('chooseInterval').value
	changeTableLook(tbl, interval);
};