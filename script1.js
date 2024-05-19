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
document.getElementById('moneyReceivedForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    // Get form values
    var earningSource = document.forms['moneyReceivedForm']['description'].value;
    var amountReceived = document.forms['moneyReceivedForm']['amount'].value;

    var currentDate = new Date();

    // Get individual components of the date
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // Note: Months are zero-indexed, so we add 1
    var day = currentDate.getDate();

    // Format the date as a string (e.g., "YYYY-MM-DD")
    var formattedDate = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
    var dateReceived = formattedDate;

    // Validate form values
    if (earningSource === '' || amountReceived === '') {
        alert('Please fill in all the fields.');
        return;
    }

    // Add a new row to the transaction table for money received
    addRowToTable(earningSource, '-', amountReceived, dateReceived, 'income');

    // Save transactions to local storage
    saveTransactions();

    // Reset the form
    document.forms['moneyReceivedForm'].reset();
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
// Function to update an existing pie chart
function updateExistingPieChart(chart, categoryExpenditures) {
    chart.data.datasets[0].data = [
        categoryExpenditures.fuel,
        categoryExpenditures.electricity,
        categoryExpenditures.bills,
        categoryExpenditures.miscellaneous
    ];
    chart.update();
}

// Function to create a new pie chart
function createNewPieChart(ctx, categoryExpenditures) {
    window.pieChart = new Chart(ctx, {
        type: 'doughnut', // or 'pie'
        data: {
            labels: ['Fuel', 'Electricity', 'Bills', 'Miscellaneous'],
            datasets: [{
                data: [
                    categoryExpenditures.fuel,
                    categoryExpenditures.electricity,
                    categoryExpenditures.bills,
                    categoryExpenditures.miscellaneous
                ],
                backgroundColor: ['#FF5733', '#FFD700', '#36A2EB', '#FF6347'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '40%', // Adjust the cutout as needed
        }
    });
}

    // Function to calculate the expenditure for a specific category
// Function to calculate the expenditure for a specific category
function calculateCategoryExpenditure(table) {
    var rowCount = table.rows.length;
    var fuelExpenditure = 0;
    var electricityExpenditure = 0;
    var billsExpenditure = 0;
    var miscellaneousExpenditure = 0;

    for (var i = 1; i < rowCount; i++) {
        var cells = table.rows[i].cells;
        var date = cells[3].innerHTML;
        var amountSpent = cells[1].innerHTML.replace('₹', '').trim();
        var transactionCategory = cells[0].innerHTML.trim();

        // Assuming date format is 'YYYY-MM-DD'
        var month = parseInt(date.split('-')[1]);

        // Check if the transaction is for December and belongs to the specified category
        if (month === 5 && amountSpent !== '-') {
            if (transactionCategory === 'Fuel') {
                fuelExpenditure += parseInt(amountSpent);
            } else if (transactionCategory === 'Electricity') {
                electricityExpenditure += parseInt(amountSpent);
            } else if (transactionCategory === 'Bills') {
                billsExpenditure += parseInt(amountSpent);
            } else if (transactionCategory === 'Miscellaneous') {
                miscellaneousExpenditure += parseInt(amountSpent);
            } else {
                continue;
            }
        }
    }

    // Return an object containing the category expenditures
    return {
        fuel: fuelExpenditure,
        electricity: electricityExpenditure,
        bills: billsExpenditure,
        miscellaneous: miscellaneousExpenditure
    };
}
function updateBarChart() {
    // Get the total expenditure from the expensediv
    var totalExpenditureElement = document.getElementById('expensediv').querySelector('strong');
    var totalExpenditure = parseFloat(totalExpenditureElement.innerHTML.replace('₹', '').trim());
    // Calculate the height of the bar based on the formula: ((363px/100)*(number of divisions))
    var barHeight = parseInt((363 / 100) * (totalExpenditure / 433.3)); // Adjusted formula

    // Get the context of the bar chart canvas element
    // var barCtx = document.getElementById('barChartCanvas'); // Updated ID
    // Create the bar chart
    
    window.barChart.data.datasets[0].data[5] = barHeight; // Update data for December
    window.barChart.update();
    

    // Update the title of the Dec graph
    var decemberOption = document.querySelector('.opt6'); // Updated class
    decemberOption.title = '₹' + totalExpenditure;

    // Update the height of the bar in the graph
    var opt6After = document.querySelector('.opt6::after');
    opt6After.style.height = barHeight + 'px';
}





// Function to dynamically calculate December's monthly expenditure
/*function calculateDecemberExpenditure(table) {
    var rowCount = table.rows.length;
    var decemberExpenditure = 0;

    for (var i = 1; i < rowCount; i++) {
        var cells = table.rows[i].cells;
        var date = cells[3].innerHTML;
        var amountSpent = cells[1].innerHTML.replace('₹', '').trim();

        // Assuming date format is 'YYYY-MM-DD'
        var month = parseInt(date.split('-')[1]);

        if (month === 12 && amountSpent !== '-') {
            decemberExpenditure += parseInt(amountSpent);
        }
    }
    var options = document.querySelector('#expensediv.center');
    var decemberOption = (document.querySelector('#barChart.options')).lastElementChild;
    decemberOption.title = '&#8377;' + decemberExpenditure.toFixed(2);

    // Update the height of the bar in the graph
    decemberOption.style.height = (options).firstElementChild + 'px';
    return decemberExpenditure;
}*/

    // Function to check if a row with the same data already exists
    function isDuplicateRow(description, amountSpent, amountReceived, date) {
        var table = document.getElementById('transactionTable');
        var rowCount = table.rows.length;

        for (var i = 1; i < rowCount; i++) {
            var cells = table.rows[i].cells;

            var existingDescription = cells[0].innerHTML;
            var existingAmountSpent = cells[1].innerHTML.replace('₹', '').trim();
            var existingAmountReceived = cells[2].innerHTML.replace('₹', '').trim();
            var existingDate = cells[3].innerHTML.trim();

            if (
                existingDescription === description &&
                existingAmountSpent === amountSpent &&
                existingAmountReceived === amountReceived &&
                existingDate === date
            ) {
                return true; // Row with the same data already exists
            }
        }

        return false; // No duplicate row found
    }

    function updateIncomeExpenditure(amountSpent, amountReceived, transactionType) {
        // Get the current income and expenditure values
        var currentIncome = parseFloat(document.getElementById('incomediv').querySelector('strong').innerHTML.replace('₹', '').trim());
        var currentExpenditure = parseFloat(document.getElementById('expensediv').querySelector('strong').innerHTML.replace('₹', '').trim());

        // Update income and expenditure based on the transaction type
        if (transactionType === 'expenditure' && amountSpent !== '-') {
            currentExpenditure += parseFloat(amountSpent);
        }

        if (transactionType === 'income' && amountReceived !== '-') {
            currentIncome += parseFloat(amountReceived);
        }

        // Update the values in the indexpro1.html page
        document.getElementById('incomediv').querySelector('strong').innerHTML = '&#8377;' + currentIncome.toFixed(2);
        document.getElementById('expensediv').querySelector('strong').innerHTML = '&#8377;' + currentExpenditure.toFixed(2);
    }
// Function to save transactions to local storage
function saveTransactions() {
    var tableRows = document.querySelectorAll('#transactionTable tr:not(:first-child)');
    var transactions = [];

    tableRows.forEach(function (row) {
        var cells = row.querySelectorAll('td');
        transactions.push({
            description: cells[0].innerHTML,
            amountSpent: cells[1].innerHTML.replace('₹', '').trim(), // Remove currency symbol and trim spaces
            amountReceived: cells[2].innerHTML.replace('₹', '').trim(), // Remove currency symbol and trim spaces
            date: cells[3].innerHTML.trim(), // Trim spaces
        });
    });

    // Save transactions to local storage
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Update the income and expense divs with the sum of the corresponding amounts
    updateIncomeExpenseDivs();

    // Dispatch a custom event to notify other parts of the application about the update
    var updateEvent = new Event('transactionsUpdated');
    //document.dispatchEvent(updateEvent);
}

// Function to load transactions from local storage on page load
function loadTransactions() {
    var transactions = localStorage.getItem('transactions');

    if (transactions) {
        transactions = JSON.parse(transactions);

        // Sort transactions by date in descending order
        transactions.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        // Clear existing rows from the table
        clearTransactionTable();
        transactions.reverse();

        transactions.forEach(function (transaction) {
            addRowToTable(
                transaction.description,
                transaction.amountSpent,
                transaction.amountReceived,
                transaction.date
            );
        });

        // Update the income and expense divs with the sum of the corresponding amounts
        updateIncomeExpenseDivs();
    }
}
   // Function to clear existing rows from the transaction table
   function clearTransactionTable() {
    var table = document.getElementById('transactionTable');
    var rowCount = table.rows.length;

    // Start from the last row and delete each row until the first row is reached
    for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

});