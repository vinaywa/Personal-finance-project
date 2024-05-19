document.addEventListener('DOMContentLoaded', function () {
 // Load existing savings goals from local storage on page load
 loadSavingsGoals();

 // Function to handle form submission for adding a new savings goal
 document.getElementById('NewSavings').addEventListener('submit', function (event) {
     event.preventDefault(); // Prevent the form from submitting in the traditional way

     // Get form values
     var description = document.forms[0]['description'].value;
     var amount = document.forms[0]['amount'].value;

     // Validate form values
     if (description === '' || amount === '') {
         alert('Please fill in all the fields.');
         return;
     }

     // Add a new row to the savings goal table
     addRowToSavingsTable(description, amount, 0);

     // Save savings goals to local storage
     saveSavingsGoals();

     // Reset the form
     document.forms[0].reset();
 });

 // Function to handle form submission for adding money to a savings goal
 document.getElementById('AddSavings').addEventListener('submit', function (event) {
     event.preventDefault(); // Prevent the form from submitting in the traditional way

     // Get form values
     var goalName = document.forms[1]['description'].value;
     var amountToAdd = document.forms[1]['amount'].value;

     // Validate form values
     if (goalName === '' || amountToAdd === '') {
         alert('Please fill in all the fields.');
         return;
     }

     // Update the amount saved for the specified goal
     updateSavingsGoal(goalName, amountToAdd);

     // Save savings goals to local storage
     saveSavingsGoals();

     // Reset the form
     document.forms[1].reset();
 });

// Function to add a new row to the savings goal table
function addRowToSavingsTable(description, amount, amountSaved) {
    var table = document.getElementById('savingsTable');

    // Create a new row
    var newRow = table.insertRow(1);

    // Insert cells
    var descriptionCell = newRow.insertCell(0);
    var amountCell = newRow.insertCell(1);
    var amountSavedCell = newRow.insertCell(2);
    var completionStatusCell = newRow.insertCell(3);

    // Set cell values
    descriptionCell.innerHTML = description;
    amountCell.innerHTML = '&#8377;' + amount;
    amountSavedCell.innerHTML = '&#8377;' + amountSaved;
    var completionStatus = (amountSaved / amount) * 100;
    completionStatusCell.innerHTML = createCompletionStatusDiv(completionStatus);
}

// Function to create a completion status div
// Function to create a completion status div
function createCompletionStatusDiv(completionStatus) {
var div = document.createElement('div');
div.classList.add('skills');

var innerDiv = document.createElement('div');
innerDiv.classList.add('car');
innerDiv.style.width = completionStatus + '%';

innerDiv.textContent = completionStatus.toFixed(2) + '%';
div.appendChild(innerDiv);

return div.outerHTML;
}
function updateSavingsGoal(goalName, amountToAdd) {
    var tableRows = document.querySelectorAll('#savingsTable tr:not(:first-child)');

    tableRows.forEach(function (row) {
        var cells = row.querySelectorAll('td');
        if (cells[0].innerHTML === goalName) {
            var currentAmountSaved = parseCurrency(cells[2].innerHTML);
            var newAmountSaved = currentAmountSaved + parseFloat(amountToAdd);
            cells[2].innerHTML = formatCurrency(newAmountSaved);
            var totalAmount = parseCurrency(cells[1].innerHTML);
            var completionStatus = (newAmountSaved / totalAmount) * 100;

            // Update completion status and progress bar
            cells[3].innerHTML = createCompletionStatusDiv(completionStatus);

            // Check if completion status is 100%
            if (completionStatus >= 100) {
                // Display a message
                alert('Congratulations! You can now buy ' + cells[0].innerHTML);

                // Remove the row from the table
                row.remove();
            }
        }
    });

    // Save savings goals to local storage
    saveSavingsGoals();
}


// Function to parse currency values and convert to float
function parseCurrency(currencyString) {
    return parseFloat(currencyString.replace(/[^0-9.-]+/g, ''));
}

// Function to format a number as currency
function formatCurrency(amount) {
    return '&#8377;' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}


});