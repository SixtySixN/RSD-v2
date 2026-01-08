// Download/Save function
function downloadInnerHtml(filename, elId, mimeType) {
    var elHtml = document.getElementById(elId).innerHTML;
    var link = document.createElement('a');
    mimeType = mimeType || 'text/plain';

    link.setAttribute('download', filename);
    link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
    link.click();
}

var fileName = '_tplt_.rsd';

$(document).ready(function() {
    $('#downloadLink').click(function() {
        downloadInnerHtml(fileName, 'template', 'text/html');
    });
});

function saveTableData(tableID) {
    var tableRef = document.getElementById(tableID);
    var tableData = [];

    // Loop through each row and cell to extract data
    for (var i = 0; i < tableRef.rows.length; i++) {
        var row = tableRef.rows[i];
        var rowData = [];

        for (var j = 0; j < row.cells.length; j++) {
            var cell = row.cells[j];
            rowData.push(cell.innerHTML.trim()); // Save cell content
        }

        // Save row data along with its class (if any)
        tableData.push({ class: row.className, cells: rowData });
    }

    // Convert table data to JSON and store it in localStorage
    localStorage.setItem(tableID + '_data', JSON.stringify(tableData));
    alert("Table data saved successfully!");
}
function loadTableData(tableID) {
    var tableRef = document.getElementById(tableID);

    // Clear existing rows
    tableRef.innerHTML = '';

    // Retrieve saved data from localStorage
    var tableData = JSON.parse(localStorage.getItem(tableID + '_data'));

    if (tableData) {
        // Recreate rows and cells from saved data
        for (var i = 0; i < tableData.length; i++) {
            var newRow = tableRef.insertRow();
            newRow.className = tableData[i].class; // Restore row class

            for (var j = 0; j < tableData[i].cells.length; j++) {
                var newCell = newRow.insertCell();
                newCell.innerHTML = tableData[i].cells[j]; // Restore cell content
            }
        }
        alert("Table data loaded successfully!");
    } else {
        alert("No saved data found for this table.");
    }
}
