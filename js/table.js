function dstrToUTC(ds) {
	// Converts date string to UTC format

	var dsarr = ds.split("-");
	var yy = parseInt(dsarr[0], 10);
	var mm = parseInt(dsarr[1], 10);
	var dd = parseInt(dsarr[2], 10);
	return Date.UTC(yy, mm-1, dd, 0, 0, 0);
}

function getDifferenceInWeeks(fromDate, toDate) {
	// Calculates the difference in weeks given the start and end date

	var d1 = dstrToUTC(fromDate);
	var d2 = dstrToUTC(toDate);
	var oneweek = 86400000 * 7;
	return Math.ceil((d2 - d1) / oneweek);
}

function addRows(tbl) {
	// Adds cells and test values for the respective columns

	var tableBodyObject = tbl.tBodies[0];
	for (var i = 0; i < tableBodyObject.rows.length; i++) {
		var newCell = tableBodyObject.rows[i].insertCell(-1);
		newCell.innerHTML = 'testing';
	}
}

function addColumns(tbl) {
	// Appends further columns to the table

	var tableHeadObject = tbl.tHead;
	var firstRowTH = document.createElement('th');
	firstRowTH.setAttribute('colspan', 5);
	firstRowTH.innerHTML = "Period";
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
	// converts a date string to JS Date() object

	date = date.toString().split("-");
	return new Date(date[0], date[1] - 1, date[2]);
} 

function getDayString(date) {
	// Returns the day of the date in string format 

	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	return days[date.getDay()];
}

function getRemainingDaysInTheWeek(beginningDate) {
	// Returns the number of days left in the week, given a date 

	var day = beginningDate.getDay();
	return 6 - day;
}

function getNewBeginningDate(date, numberOfRemainingDays) {
	// Returns the Sunday of the following week

	date.setDate(date.getDate() + numberOfRemainingDays + 1);
	return date;
}

function changeTableLook(interval) {
	// Main function that updates the look of the table

	// If the chosen interval is week
	if (interval == "week") {
		// Obtain table to modify
		var tbl = document.getElementById("mytable");

		// Obtain date inputs to calculate number of weeks to be displayed
		var dateFromInput = document.getElementById('dateFromInput').value;
		var dateToInput = document.getElementById('dateToInput').value;

		// 1. Calculate difference in weeks

		// a. Obtain the day of the first date
		var convertedBeginningDate = convertToDate(dateFromInput);
		var beginningDay = getDayString(convertedBeginningDate);

		// b. Calculate remaining days of that week
		var numberOfRemainingDays = getRemainingDaysInTheWeek(convertedBeginningDate);
		// console.log("numberOfRemainingDays: ", numberOfRemainingDays);
		// 2. Update new 'fromDate'
		var newBeginningDate = getNewBeginningDate(convertedBeginningDate, numberOfRemainingDays);

		// 3. Call calculateDifferenceInWeeks method
		// Convert to input form in order to typecast into getDifferenceInWeeks parameters
		newBeginningDate.setMonth(newBeginningDate.getMonth() + 1)
		var newBgnDateString = newBeginningDate.getFullYear() + "-" + newBeginningDate.getMonth() + "-" + newBeginningDate.getDate()
		var differenceInWeeks = 1 + getDifferenceInWeeks(newBgnDateString, dateToInput);

		// console.log("difference: ", differenceInWeeks);

		// Add as many additional columns as number of weeks
		for (var i = 0; i < differenceInWeeks; i++) {
			addColumns(tbl);	
		}

	} else if (interval == "month") {

	} else if (interval == "year") {

	}
} 

var submit = function() {
	// Calls the function that updates the look of the table when the submit button is pressed

	changeTableLook(document.getElementById('chooseInterval').value);
};