function addRows(tbl) {
	// Adds cells and test values for the respective columns

	var tableBodyObject = tbl.tBodies[0];
	for (var i = 0; i < tableBodyObject.rows.length; i++) {
		var newCell = tableBodyObject.rows[i].insertCell(-1);
		newCell.innerHTML = 'testing' +  i;
	}
}

function addColumns(tbl, startDateOfWeek, endDateOfWeek) {
	// Appends further columns to the table

	var tableHeadObject = tbl.tHead;
	var firstRowTH = document.createElement('th');
	firstRowTH.setAttribute('colspan', 5);
	firstRowTH.innerHTML = "Period -- " + startDateOfWeek + " - " + endDateOfWeek;
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

function convertToDate(date) {
	// converts an html date input to JS Date() object

	date = date.toString().split("-");
	return new Date(date[0], date[1] - 1, date[2]);
} 

function convertDateToString(date) {
	// converts date to string

	var newDate = new Date(date);
	newDate.setMonth(newDate.getMonth() + 1);
	newDate = newDate.getFullYear() + "-" + newDate.getMonth() + "-" + newDate.getDate();
	return newDate;
}

function dateStringToUTC(dateString) {
	// Converts date string to UTC format

	var dateStringArray = dateString.split("-");
	var yy = parseInt(dateStringArray[0], 10);
	var mm = parseInt(dateStringArray[1], 10);
	var dd = parseInt(dateStringArray[2], 10);
	return Date.UTC(yy, mm - 1, dd, 0, 0, 0);
}

function getDayName(date) {
	// Returns the day name of the date in string format 

	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	return days[date.getDay()];
}

function getDifferenceInWeeks(fromDate, toDate) {
	// Calculates the difference in weeks given the start and end date

	var d1 = dateStringToUTC(fromDate);
	var d2 = dateStringToUTC(toDate);
	var oneweek = 86400000 * 7;
	return Math.ceil((d2 - d1) / oneweek);
}

function getRemainingDaysInTheWeek(beginningDate) {
	// Returns the number of days left in the week, given a date 

	var day = beginningDate.getDay();
	return 6 - day;
}

function setDateOffset(date, offset) {
	// Returns the date after adding the offset
	
	var newDate = new Date(date);
	newDate.setDate(newDate.getDate() + offset);
	return newDate;
}


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

function changeTableLook(interval) {
	// Main function that updates the look of the table

	// If the chosen interval is week
	if (interval == "week") {
		var iDateFromInput = document.getElementById('dateFromInput').value;
		var iDateToInput = document.getElementById('dateToInput').value;

		/* 
		Calculate weeks between the interval of dates

		- Calculate remaining days of that week
		- Include the above week in calculating the difference
		- Update new start date to the Sunday of next week
		- Calculate difference in weeks for the remaining days (if any)
		*/

		var dStartDate = convertToDate(iDateFromInput);
		var numberOfRemainingDays = getRemainingDaysInTheWeek(dStartDate);
		var dNewStartDate = setDateOffset(dStartDate, numberOfRemainingDays + 1);
		var sNewStartDate = convertDateToString(dNewStartDate);
		
		var differenceInWeeks = 1 + getDifferenceInWeeks(sNewStartDate, iDateToInput);

		/* 
		Calculate period

		- Obtain date intervals
		- Convert them to JS Date type
		- Calculate offset till end of the first week
		- Calculate end date of the week
		- Check if the end of the interval input is greater than the date calculated after offset
		- Send the period values as parameters to addColumns() and calculate subsequent intervals 
		by adding 1 and 7 to the previous end date until the toDate is smaller than the calc date
		*/
		
		var fromDate = iDateFromInput;
		var toDate = iDateToInput;

		var dFromDate = convertToDate(fromDate);
		var dToDate = convertToDate(toDate);
		
		var offset = getRemainingDaysInTheWeek(dFromDate);
		
		var dEndDateOfWeek = setDateOffset(dFromDate, offset);
		
		dEndDateOfWeek = (dEndDateOfWeek > dToDate) ? dToDate : dEndDateOfWeek;

		var sStartDateOfWeek = convertDateToString(dFromDate);
		var sEndDateOfWeek = convertDateToString(dEndDateOfWeek);
		
		// Add as many additional columns as number of weeks
		for (var i = 0; i < differenceInWeeks; i++) {
			addColumns(tbl, sStartDateOfWeek, sEndDateOfWeek);	
			
			// Update the start and end of next week
			dStartDateOfWeek = setDateOffset(sEndDateOfWeek, 1);
			dEndDateOfWeek = setDateOffset(dStartDateOfWeek, 6);
			dEndDateOfWeek = (dEndDateOfWeek > dToDate) ? dToDate : dEndDateOfWeek;
			sStartDateOfWeek = convertDateToString(dStartDateOfWeek);
			sEndDateOfWeek = convertDateToString(dEndDateOfWeek);
		}
	} else if (interval == "month") {

	} else if (interval == "year") {

	}
} 

var submit = function() {
	// Calls the function that updates the look of the table when the submit button is pressed after input validation
	
	var fromDate = document.getElementById('dateFromInput').value;
	var toDate = document.getElementById('dateToInput').value;
	if (fromDate > toDate) {
		return;
	}

	changeTableLook(document.getElementById('chooseInterval').value);
};