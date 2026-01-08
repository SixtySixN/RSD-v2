/* Add single row to PA Table */
function addRow(tableID) {
    var tableRef = document.getElementById(tableID);
    if (!tableRef) return;

    // Detect if "type" and "circuit" columns already exist in the table (header or body)
    var hasTypeCol = tableRef.querySelector('tr td.type, tr th.type') !== null;
    var hasCircuitCol = tableRef.querySelector('tr td.circuit, tr th.circuit') !== null;

    var newRow = tableRef.insertRow(-1);

    // CABINET #
    var newCell = newRow.insertCell(0);
    var newElem = document.createElement('cell');
    newElem.setAttribute("name", "CABINET #");
    newElem.setAttribute("value", "");
    newCell.appendChild(newElem);

    // TYPE (only if the table already has a type column)
    if (hasTypeCol) {
        newCell = newRow.insertCell(-1);
        newCell.setAttribute("class", "type");
        newElem = document.createElement('input');
        newElem.setAttribute("list", "type");
        newElem.setAttribute("class", "type");
        newElem.setAttribute("name", "TYPE");
        newElem.setAttribute("type", "text");
        newCell.appendChild(newElem);
    }

    // SPLAY ANGLE (always add)
    newCell = newRow.insertCell(-1);
    newCell.setAttribute("class", "splay");
    newElem = document.createElement('input');
    newElem.setAttribute("list", "angle");
    newElem.setAttribute("class", "splay");
    newElem.setAttribute("name", "SPLAY ANGLE");
    newElem.setAttribute("type", "text");
    newCell.appendChild(newElem);

    // CIRCUIT (only if the table already has a circuit column)
    if (hasCircuitCol) {
        newCell = newRow.insertCell(-1);
        newCell.setAttribute("class", "circuit");
        newElem = document.createElement('input');
        newElem.setAttribute("class", "circuit");
        newElem.setAttribute("name", "CIRCUIT");
        newElem.setAttribute("type", "text");
        newCell.appendChild(newElem);
    }
}
/*Add multiple rows to PA Tables - v4 - blank row skipping fixed*/
/* addMultiRows1 = Add to Main PA Table */
function addMultiRows1(tableID) {
    var table = document.getElementById(tableID);
    var rowsToAdd = parseInt(document.getElementById('numBoxesMain').value);

    // Add the specified number of regular rows
    for (var i = 1; i <= rowsToAdd; i++) {
        addRow(tableID);
    }

    var rowCounter = 0;
    var rowsPerCase = parseInt(document.getElementById('numPerCaseMain').value);

    // Process rows without adding blank rows where they already exist
    $('#mainpatbl > tbody > tr').each(function () {
        // Skip processing if this is already a blank row
        if ($(this).hasClass('blankrow')) {
            return; // Skip this iteration
        }

        rowCounter++;

        // Add a blank row only after non-blank rows and ensure it doesn't duplicate
        if (rowCounter % rowsPerCase === 0 && !$(this).next().hasClass('blankrow')) {
            $(this).after('<tr class="blankrow"></tr>');
        }
    });
}


/* addMultiRows2 = Add to Side PA Table */
function addMultiRows2(tableID) {
    var table = document.getElementById(tableID);
    var rowsToAdd = parseInt(document.getElementById('numBoxesSide').value);

    // Add the specified number of regular rows
    for (var i = 1; i <= rowsToAdd; i++) {
        addRow(tableID);
    }

    var rowCounter = 0;
    var rowsPerCase = parseInt(document.getElementById('numPerCaseSide').value);

    // Process rows without adding blank rows where they already exist
    $('#sidepatbl > tbody > tr').each(function () {
        // Skip processing if this is already a blank row
        if ($(this).hasClass('blankrow')) {
            return; // Skip this iteration
        }

        rowCounter++;

        // Add a blank row only after non-blank rows and ensure it doesn't duplicate
        if (rowCounter % rowsPerCase === 0 && !$(this).next().hasClass('blankrow')) {
            $(this).after('<tr class="blankrow"></tr>');
        }
    });
}

/* Add blank 'split' line to PA Tables */
function addSplit(tableID) {
    var tableRef = document.getElementById(tableID);
    var newRow = tableRef.insertRow(-1);

    newRow.setAttribute("class", "blankrow");
    newRow.setAttribute("colspan", "4");
}

/* Delete last row from PA Tables */
function deleteRow(tableID) {
    var table = document.getElementById(tableID);

        table.deleteRow(-1);
    
}

/* Adds a row to Rigging Table */
function addRig(tableID) {

    var tableRef = document.getElementById(tableID);
    var newRow = tableRef.insertRow(-1);

    var newCell = newRow.insertCell(0);
    newCell.setAttribute("class", "userrigcell")
    var newElem = document.createElement('input');
    newElem.setAttribute("class", "userrig");
    newElem.setAttribute("id", "rigText")
    newElem.setAttribute("name", "userrig");
    newCell.appendChild(newElem);

    newCell = newRow.insertCell(1);
    newCell.setAttribute("class", "userrigcell")
    newCell.setAttribute("colspan", "2");
    newElem = document.createElement('input');
    newElem.setAttribute("class", "userunit");
    newElem.setAttribute("id", "rigText")
    newElem.setAttribute("name", "userunit");
    newCell.appendChild(newElem);
}

function gotoPage(select){
        window.location = select.value;
}

// Toggle sidebar sections
function toggleSection(sectionId) {
    var content = document.getElementById(sectionId + '-content');
    var icon = document.getElementById(sectionId + '-icon');
    
    // Check computed style to handle CSS-defined display property
    var isHidden = window.getComputedStyle(content).display === 'none';
    
    if (isHidden) {
        content.style.display = 'block';
        icon.innerHTML = '▼';
    } else {
        content.style.display = 'none';
        icon.innerHTML = '▶';
    }
}
// Removes element - in this case the logo
function removeElement(elementId) {
    var element = document.getElementById(elementId);
    
    element.parentNode.removeChild(element);
    element.setAttribute("width", "1px");
}

// Helper function to toggle rigging rows (works with both old and new template system)
function toggleRiggingRows(tableId, toggleId, show) {
    var table = $('#' + tableId);
    
    // Determine which array this is (main or side)
    var isMainArray = (tableId === 'mainrigtbl');
    var showFrontRearCheckbox = isMainArray ? '#showFrontRearLoadMain' : '#showFrontRearLoadSide';
    
    // Try new template system first (data-toggle-id attribute)
    var rowsWithToggleId = table.find('tr[data-toggle-id="' + toggleId + '"]');
    
    if (rowsWithToggleId.length > 0) {
        // New template system
        if (show) {
            rowsWithToggleId.show();
            if (toggleId === 'singlePoint') {
                // Only hide FRONT/REAR LOAD if the "Show Front/Rear Load" checkbox is NOT checked
                if (!$(showFrontRearCheckbox).is(':checked')) {
                    table.find('tr:contains("FRONT LOAD"), tr:contains("REAR LOAD")').not('[data-toggle-id]').hide();
                }
            }
        } else {
            rowsWithToggleId.hide();
            if (toggleId === 'singlePoint') {
                table.find('tr:contains("FRONT LOAD"), tr:contains("REAR LOAD")').not('[data-toggle-id]').show();
            }
        }
    } else {
        // Fallback to old system (search by text)
        if (toggleId === 'singlePoint') {
            if (show) {
                table.find('tr:contains("SINGLE POINT")').show();
                // Only hide FRONT/REAR LOAD if the "Show Front/Rear Load" checkbox is NOT checked
                if (!$(showFrontRearCheckbox).is(':checked')) {
                    table.find('tr:contains("FRONT LOAD"), tr:contains("REAR LOAD")').hide();
                }
            } else {
                table.find('tr:contains("SINGLE POINT")').hide();
                table.find('tr:contains("FRONT LOAD"), tr:contains("REAR LOAD")').show();
            }
        } else if (toggleId === 'trimStage') {
            if (show) {
                table.find('tr:contains("TRIM - STAGE")').show();
            } else {
                table.find('tr:contains("TRIM - STAGE")').hide();
            }
        }
    }
}

// Function to apply column widths for Main PA based on checkbox states (GLOBAL)
function applyColumnWidthsMain() {
    var typeVisible = $('#typeColumnToggleMain').is(':checked');
    var circuitVisible = $('#circuitColumnToggleMain').is(':checked');
    
    if (typeVisible && circuitVisible) {
        // Both visible - original widths
        $('#mainpatblhead .col-cabinet, #mainpatbl .col-cabinet').css('width', '14%');
        $('#mainpatblhead .col-type, #mainpatbl .col-type').css({'display': '', 'width': '20%'});
        $('#mainpatblhead th.type, #mainpatbl td.type').show();
        $('#mainpatblhead .col-splay, #mainpatbl .col-splay').css('width', '40%');
        $('#mainpatblhead .col-circuit, #mainpatbl .col-circuit').css({'display': '', 'width': '26%'});
        $('#mainpatblhead th.circuit, #mainpatbl td.circuit').show();
    } else if (typeVisible && !circuitVisible) {
        // Type visible, Circuit hidden
        $('#mainpatblhead .col-cabinet, #mainpatbl .col-cabinet').css('width', '18.9%');
        $('#mainpatblhead .col-type, #mainpatbl .col-type').css({'display': '', 'width': '27%'});
        $('#mainpatblhead th.type, #mainpatbl td.type').show();
        $('#mainpatblhead .col-splay, #mainpatbl .col-splay').css('width', '54.1%');
        $('#mainpatblhead .col-circuit, #mainpatbl .col-circuit').css('display', 'none');
        $('#mainpatblhead th.circuit, #mainpatbl td.circuit').hide();
    } else if (!typeVisible && circuitVisible) {
        // Type hidden, Circuit visible
        $('#mainpatblhead .col-cabinet, #mainpatbl .col-cabinet').css('width', '17.5%');
        $('#mainpatblhead .col-type, #mainpatbl .col-type').css('display', 'none');
        $('#mainpatblhead th.type, #mainpatbl td.type').hide();
        $('#mainpatblhead .col-splay, #mainpatbl .col-splay').css('width', '50%');
        $('#mainpatblhead .col-circuit, #mainpatbl .col-circuit').css({'display': '', 'width': '32.5%'});
        $('#mainpatblhead th.circuit, #mainpatbl td.circuit').show();
    } else {
        // Both hidden
        $('#mainpatblhead .col-cabinet, #mainpatbl .col-cabinet').css('width', '25.9%');
        $('#mainpatblhead .col-type, #mainpatbl .col-type').css('display', 'none');
        $('#mainpatblhead th.type, #mainpatbl td.type').hide();
        $('#mainpatblhead .col-splay, #mainpatbl .col-splay').css('width', '74.1%');
        $('#mainpatblhead .col-circuit, #mainpatbl .col-circuit').css('display', 'none');
        $('#mainpatblhead th.circuit, #mainpatbl td.circuit').hide();
    }
}

// Function to apply column widths for Side PA based on checkbox states (GLOBAL)
function applyColumnWidthsSide() {
    var typeVisible = $('#typeColumnToggleSide').is(':checked');
    var circuitVisible = $('#circuitColumnToggleSide').is(':checked');
    
    if (typeVisible && circuitVisible) {
        // Both visible - original widths
        $('#sidepatblhead .col-cabinet, #sidepatbl .col-cabinet').css('width', '14%');
        $('#sidepatblhead .col-type, #sidepatbl .col-type').css({'display': '', 'width': '20%'});
        $('#sidepatblhead th.type, #sidepatbl td.type').show();
        $('#sidepatblhead .col-splay, #sidepatbl .col-splay').css('width', '40%');
        $('#sidepatblhead .col-circuit, #sidepatbl .col-circuit').css({'display': '', 'width': '26%'});
        $('#sidepatblhead th.circuit, #sidepatbl td.circuit').show();
    } else if (typeVisible && !circuitVisible) {
        // Type visible, Circuit hidden
        $('#sidepatblhead .col-cabinet, #sidepatbl .col-cabinet').css('width', '18.9%');
        $('#sidepatblhead .col-type, #sidepatbl .col-type').css({'display': '', 'width': '27%'});
        $('#sidepatblhead th.type, #sidepatbl td.type').show();
        $('#sidepatblhead .col-splay, #sidepatbl .col-splay').css('width', '54.1%');
        $('#sidepatblhead .col-circuit, #sidepatbl .col-circuit').css('display', 'none');
        $('#sidepatblhead th.circuit, #sidepatbl td.circuit').hide();
    } else if (!typeVisible && circuitVisible) {
        // Type hidden, Circuit visible
        $('#sidepatblhead .col-cabinet, #sidepatbl .col-cabinet').css('width', '17.5%');
        $('#sidepatblhead .col-type, #sidepatbl .col-type').css('display', 'none');
        $('#sidepatblhead th.type, #sidepatbl td.type').hide();
        $('#sidepatblhead .col-splay, #sidepatbl .col-splay').css('width', '50%');
        $('#sidepatblhead .col-circuit, #sidepatbl .col-circuit').css({'display': '', 'width': '32.5%'});
        $('#sidepatblhead th.circuit, #sidepatbl td.circuit').show();
    } else {
        // Both hidden
        $('#sidepatblhead .col-cabinet, #sidepatbl .col-cabinet').css('width', '25.9%');
        $('#sidepatblhead .col-type, #sidepatbl .col-type').css('display', 'none');
        $('#sidepatblhead th.type, #sidepatbl td.type').hide();
        $('#sidepatblhead .col-splay, #sidepatbl .col-splay').css('width', '74.1%');
        $('#sidepatblhead .col-circuit, #sidepatbl .col-circuit').css('display', 'none');
        $('#sidepatblhead th.circuit, #sidepatbl td.circuit').hide();
    }
}

// Sidebar toggle handlers and column width management
$(document).ready(function() {
    // Hide Single Point rows by default for both arrays
    $('#mainrigtbl tr:contains("SINGLE POINT")').hide();
    $('#siderigtbl tr:contains("SINGLE POINT")').hide();
    $('#mainrigtbl tr[data-toggle-id="singlePoint"]').hide();
    $('#siderigtbl tr[data-toggle-id="singlePoint"]').hide();
    
    // Array 1 (Main) Single Point toggle
    $('#singlePointToggleMain').change(function() {
        toggleRiggingRows('mainrigtbl', 'singlePoint', $(this).is(':checked'));
    });
    
    // Array 2 (Side) Single Point toggle
    $('#singlePointToggleSide').change(function() {
        toggleRiggingRows('siderigtbl', 'singlePoint', $(this).is(':checked'));
    });
    
    // Array 1 (Main) Show Front/Rear Load toggle
    $('#showFrontRearLoadMain').change(function() {
        var singlePointChecked = $('#singlePointToggleMain').is(':checked');
        var showFrontRear = $(this).is(':checked');
        if (singlePointChecked) {
            // If Single Point is checked, show/hide front/rear load rows based on checkbox state
            if (showFrontRear) {
                $('#mainrigtbl tr:contains("FRONT LOAD"), #mainrigtbl tr:contains("REAR LOAD")').not('[data-toggle-id]').show();
            } else {
                $('#mainrigtbl tr:contains("FRONT LOAD"), #mainrigtbl tr:contains("REAR LOAD")').not('[data-toggle-id]').hide();
            }
        }
    });
    
    // Array 2 (Side) Show Front/Rear Load toggle
    $('#showFrontRearLoadSide').change(function() {
        var singlePointChecked = $('#singlePointToggleSide').is(':checked');
        var showFrontRear = $(this).is(':checked');
        if (singlePointChecked) {
            // If Single Point is checked, show/hide front/rear load rows based on checkbox state
            if (showFrontRear) {
                $('#siderigtbl tr:contains("FRONT LOAD"), #siderigtbl tr:contains("REAR LOAD")').not('[data-toggle-id]').show();
            } else {
                $('#siderigtbl tr:contains("FRONT LOAD"), #siderigtbl tr:contains("REAR LOAD")').not('[data-toggle-id]').hide();
            }
        }
    });
    
    // Hide Trim-Stage rows by default for both arrays
    $('#mainrigtbl tr:contains("TRIM - STAGE")').hide();
    $('#siderigtbl tr:contains("TRIM - STAGE")').hide();
    
    // Array 1 (Main) Trim-Stage toggle
    $('#trimStageToggleMain').change(function() {
        toggleRiggingRows('mainrigtbl', 'trimStage', $(this).is(':checked'));
    });
    
    // Array 2 (Side) Trim-Stage toggle
    $('#trimStageToggleSide').change(function() {
        toggleRiggingRows('siderigtbl', 'trimStage', $(this).is(':checked'));
    });
    
    // Type Column toggles for PA tables
    // Array 1 (Main PA) Type Column toggle
    $('#typeColumnToggleMain').change(function() {
        applyColumnWidthsMain();
    });
    
    // Array 2 (Side PA) Type Column toggle
    $('#typeColumnToggleSide').change(function() {
        applyColumnWidthsSide();
    });
    
    // Array 1 (Main PA) Circuit Column toggle
    $('#circuitColumnToggleMain').change(function() {
        applyColumnWidthsMain();
    });
    
    // Array 2 (Side PA) Circuit Column toggle
    $('#circuitColumnToggleSide').change(function() {
        applyColumnWidthsSide();
    });
});
       