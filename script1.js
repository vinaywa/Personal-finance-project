document.addEventListener('DOMContentLoaded', function () {
// Load existing transactions from local storage on page load
loadTransactions();

// Function to handle form submission for expenditure
document.getElementById('expenditureForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    // Get form values
    var description = document.forms['expenditureForm']['description'].value;
    var amount = document.forms['expenditureForm']['amount'].value;

    // Create a new Date object (represents the current date and time)
    var currentDate = new Date();

    // Get individual components of the date
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // Note: Months are zero-indexed, so we add 1
    var day = currentDate.getDate();

    // Format the date as a string (e.g., "YYYY-MM-DD")
    var formattedDate = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
    var date = formattedDate;

    // Validate form values
    if (description === 'Select transaction' || amount === '') {
        alert('Please fill in all the fields.');
        return;
    }

    // Add a new row to the transaction table for expenditure
    addRowToTable(description, amount, '-', date, 'expenditure');

    // Save transactions to local storage
    saveTransactions();
    updateCharts();

    // Reset the form
    document.forms['expenditureForm'].reset();
    
});

// Function to add a new row to the transaction table
function addRowToTable(description, amountSpent, amountReceived, date, transactionType) {
    var table = document.getElementById('transactionTable');

    // Check if a row with the same data already exists
    if (isDuplicateRow(description, amountSpent, amountReceived, date)) {
        alert('This transaction already exists.');
        return;
    }

    // Create a new row
    var newRow = table.insertRow(1);

    // Insert cells
    var descriptionCell = newRow.insertCell(0);
    var amountSpentCell = newRow.insertCell(1);
    var amountReceivedCell = newRow.insertCell(2);
    var dateCell = newRow.insertCell(3);

    // Set cell values
    descriptionCell.innerHTML = description;
    amountSpentCell.innerHTML = (amountSpent !== '-') ? '&#8377;' + amountSpent : '-';
    amountReceivedCell.innerHTML = (amountReceived !== '-') ? '&#8377;' + amountReceived : '-';
    dateCell.innerHTML = date;

    // Update income and expenditure values
    updateIncomeExpenditure(amountSpent, amountReceived, transactionType);
}
function updateIncomeExpenseDivs() {
    var tableRows = document.querySelectorAll('#transactionTable tr:not(:first-child)');
    var totalIncome = 0;
    var totalExpense = 0;

    tableRows.forEach(function (row) {
        var cells = row.querySelectorAll('td');
        var amountSpent = cells[1].innerHTML.replace('₹', '').trim();
        var amountReceived = cells[2].innerHTML.replace('₹', '').trim();

        if (amountSpent !== '-') {
            totalExpense += parseFloat(amountSpent);
        }

        if (amountReceived !== '-') {
            totalIncome += parseFloat(amountReceived);
        }
    });

    document.getElementById('incomediv').querySelector('strong').innerHTML = '&#8377;' + totalIncome.toFixed(2);
    document.getElementById('expensediv').querySelector('strong').innerHTML = '&#8377;' + totalExpense.toFixed(2);
}
function updateCharts() {
    updatePieChart();
    updateBarChart();
    // Dispatch the custom event after updating the charts
    var updateEvent = new Event('transactionsUpdated');
    document.dispatchEvent(updateEvent);
}

// Function to update the pie chart
// Function to update the pie chart
function updatePieChart() {
var pieCanvas = document.getElementById('div2');
if (!pieCanvas) {
    console.error('Pie canvas element not found');
    return;
}

var pieCtx = pieCanvas;
if (!pieCtx) {
    console.error('Unable to get 2D context for pie canvas');
    return;
}

// Clear previous background image
pieCanvas.style.backgroundImage = 'none';

var table = document.getElementById('transactionTable');
var totalExpenditure = parseFloat(document.getElementById('expensediv').querySelector('strong').innerHTML.replace('₹', '').trim());
var categoryExpenditures = calculateCategoryExpenditure(table);

// Calculate the angles for each category
var fuelAngle = (categoryExpenditures.fuel / totalExpenditure) * 360;
var electricityAngle = (categoryExpenditures.electricity / totalExpenditure) * 360;
var billsAngle = (categoryExpenditures.bills / totalExpenditure) * 360;
var miscellaneousAngle = (categoryExpenditures.miscellaneous / totalExpenditure) * 360;

// Adjust the conic gradient based on the angle ranges for each category
var conicGradient = `repeating-conic-gradient(
    from 0deg,
    red 0deg ${fuelAngle}deg,
    yellow ${fuelAngle}deg ${fuelAngle + electricityAngle}deg,
    green ${fuelAngle + electricityAngle}deg ${fuelAngle + electricityAngle + billsAngle}deg,
    blue ${fuelAngle + electricityAngle + billsAngle}deg ${fuelAngle + electricityAngle + billsAngle + miscellaneousAngle}deg,
    red ${fuelAngle + electricityAngle + billsAngle + miscellaneousAngle}deg 360deg
)`;

// Apply the conic gradient to the pie chart container
pieCanvas.style.backgroundImage = conicGradient;

updateExistingPieChart(window.pieChart, categoryExpenditures);

}

});