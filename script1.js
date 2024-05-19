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

});