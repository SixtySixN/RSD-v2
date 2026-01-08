// Template Manager for RSD
var currentTemplateMain = null;
var currentTemplateSide = null;

// Load and apply a template for a specific array (supports both .json and .txt formats)
function loadTemplate(templateName, arrayType) {
    // Try JSON first
    $.getJSON('templates/' + templateName + '.json', function(template) {
        if (arrayType === 'main') {
            currentTemplateMain = template;
        } else {
            currentTemplateSide = template;
        }
        applyTemplate(template, arrayType);
    }).fail(function() {
        // Try text format
        $.get('templates/' + templateName + '.txt', function(textData) {
            var template = parseTextTemplate(textData);
            if (arrayType === 'main') {
                currentTemplateMain = template;
            } else {
                currentTemplateSide = template;
            }
            applyTemplate(template, arrayType);
        }).fail(function() {
            console.error('Failed to load template: ' + templateName);
            alert('Could not load template: ' + templateName);
        });
    });
}

// Parse text-based template format
function parseTextTemplate(text) {
    var lines = text.split('\n');
    var template = {
        name: '',
        description: '',
        paColumns: { type: true, circuit: true },
        rigging: []
    };
    
    lines.forEach(function(line) {
        line = line.trim();
        
        // Skip comments and empty lines
        if (!line || line.startsWith('#')) return;
        
        // Parse key=value pairs
        if (line.includes('=') && !line.startsWith('rigcell=')) {
            var parts = line.split('=');
            var key = parts[0].trim();
            var value = parts[1].trim();
            
            if (key === 'name') {
                template.name = value;
            } else if (key === 'description') {
                template.description = value;
            } else if (key === 'type') {
                template.paColumns.type = value.toLowerCase() === 'true';
            } else if (key === 'circuit') {
                template.paColumns.circuit = value.toLowerCase() === 'true';
            }
        }
        
        // Parse rigging rows: rigcell=LABEL | unit | visible | placeholder | colspan | toggleId
        if (line.startsWith('rigcell=')) {
            var rowData = line.substring(8); // Remove "rigcell="
            var parts = rowData.split('|').map(function(p) { return p.trim(); });
            
            var row = {
                label: parts[0] || '',
                unit: parts[1] === 'FALSE' ? false : (parts[1] || 'm'),
                visible: parts[2] ? parts[2].toLowerCase() === 'true' : true
            };
            
            if (parts[3]) row.placeholder = parts[3];
            if (parts[4] && parts[4].toLowerCase() === 'true') row.colspan = true;
            if (parts[5]) row.toggleId = parts[5];
            
            template.rigging.push(row);
        }
    });
    
    return template;
}

// Apply template to specific array
function applyTemplate(template, arrayType) {
    // Apply PA column visibility for specific array
    applyPAColumns(template.paColumns, arrayType);
    
    // Apply rigging table structure for specific array
    applyRiggingTable(template.rigging, arrayType);
    
    console.log('Template applied:', template.name, 'to', arrayType);
}

// Apply PA column visibility settings to specific array
function applyPAColumns(columns, arrayType) {
    // Use setTimeout to ensure tables are in DOM
    setTimeout(function() {
        if (arrayType === 'main') {
            // Set Type column visibility
            $('#typeColumnToggleMain').prop('checked', columns.type);
            
            // Set Circuit column visibility
            $('#circuitColumnToggleMain').prop('checked', columns.circuit);
            
            // Apply the column widths (now globally accessible)
            applyColumnWidthsMain();
            
            // Disable checkboxes so template controls them
            $('#typeColumnToggleMain').prop('disabled', true);
            $('#circuitColumnToggleMain').prop('disabled', true);
        } else {
            // Set Type column visibility
            $('#typeColumnToggleSide').prop('checked', columns.type);
            
            // Set Circuit column visibility
            $('#circuitColumnToggleSide').prop('checked', columns.circuit);
            
            // Apply the column widths (now globally accessible)
            applyColumnWidthsSide();
            
            // Disable checkboxes so template controls them
            $('#typeColumnToggleSide').prop('disabled', true);
            $('#circuitColumnToggleSide').prop('disabled', true);
        }
    }, 200);
}

// Build rigging table from template for specific array
function applyRiggingTable(riggingConfig, arrayType) {
    if (arrayType === 'main') {
        buildRiggingTable('mainrigtbl', riggingConfig, 'Main');
    } else {
        buildRiggingTable('siderigtbl', riggingConfig, 'Side');
    }
}

function buildRiggingTable(tableId, riggingConfig, arrayName) {
    var table = $('#' + tableId);
    var tbody = table.find('tbody');
    
    // Clear existing rows
    tbody.empty();
    
    // Build rows from config
    riggingConfig.forEach(function(row) {
        var tr = $('<tr>');
        
        // Handle visibility
        if (!row.visible) {
            tr.css('display', 'none');
        }
        
        // Add toggle ID for dynamic showing/hiding
        if (row.toggleId) {
            tr.attr('data-toggle-id', row.toggleId);
        }
        
        // Label cell
        var labelCell = $('<td class="rigcell">').text(row.label + '\u00A0');
        tr.append(labelCell);
        
        // Input cell
        var inputCell = $('<td class="rigcell1">');
        if (row.colspan) {
            inputCell.attr('colspan', '2');
            inputCell.removeClass('rigcell1').addClass('rigcell2');
        }
        
        var input = $('<input>');
        if (row.colspan) {
            input.addClass('rig2');
        } else {
            input.addClass('rig1');
        }
        input.attr('type', 'text');
        
        if (row.placeholder) {
            input.attr('placeholder', row.placeholder);
        }
        
        inputCell.append(input);
        tr.append(inputCell);
        
        // Unit cell (only if not colspan)
        if (!row.colspan && row.unit !== false) {
            var unitCell = $('<td class="unitscell">').text(row.unit);
            tr.append(unitCell);
        } else if (!row.colspan) {
            var emptyCell = $('<td class="unitscell">');
            tr.append(emptyCell);
        }
        
        tbody.append(tr);
    });
}

// Reset to manual mode (enable checkboxes) for specific array
function resetTemplate(arrayType) {
    if (arrayType === 'main') {
        currentTemplateMain = null;
        
        // Enable manual column toggles
        $('#typeColumnToggleMain').prop('disabled', false);
        $('#circuitColumnToggleMain').prop('disabled', false);
        
        console.log('Template reset - manual mode for Array 1');
    } else {
        currentTemplateSide = null;
        
        // Enable manual column toggles
        $('#typeColumnToggleSide').prop('disabled', false);
        $('#circuitColumnToggleSide').prop('disabled', false);
        
        console.log('Template reset - manual mode for Array 2');
    }
}

// Scan templates folder and populate dropdowns
function populateTemplateSelectors() {
    try {
        // For nw.js, use window.require
        var fs = window.require('fs');
        var path = window.require('path');
        
        // Get the app directory - try multiple paths
        var appPath = process.cwd();
        var templatesDir = path.join(appPath, 'app', 'templates');
        
        // If not found, try current directory
        if (!fs.existsSync(templatesDir)) {
            templatesDir = path.join(appPath, 'templates');
        }
        
        // Check if templates directory exists
        if (!fs.existsSync(templatesDir)) {
            alert('Templates folder not found at: ' + templatesDir);
            throw new Error('Templates folder not found');
        }
        
        // Read all files in templates directory
        var files = fs.readdirSync(templatesDir);
        
        // Filter for .json and .txt files
        var templates = [];
        files.forEach(function(file) {
            var ext = path.extname(file).toLowerCase();
            if (ext === '.json' || ext === '.txt') {
                var basename = path.basename(file, ext);
                var filePath = path.join(templatesDir, file);
                var displayName = basename;
                
                try {
                    // Try to read the name from the file
                    var content = fs.readFileSync(filePath, 'utf8');
                    
                    if (ext === '.json') {
                        // Parse JSON and get name field
                        var json = JSON.parse(content);
                        if (json.name) {
                            displayName = json.name;
                        }
                    } else if (ext === '.txt') {
                        // Parse text format and look for name=
                        var lines = content.split('\n');
                        for (var i = 0; i < lines.length; i++) {
                            var line = lines[i].trim();
                            if (line.startsWith('name=')) {
                                displayName = line.substring(5).trim();
                                break;
                            }
                        }
                    }
                } catch (readErr) {
                    // If reading fails, use formatted basename as fallback
                    displayName = basename
                        .replace(/_/g, ' ')
                        .split(' ')
                        .map(function(word) {
                            return word.charAt(0).toUpperCase() + word.slice(1);
                        })
                        .join(' ');
                }
                
                templates.push({
                    value: basename,
                    name: displayName
                });
            }
        });
        
        // Sort templates alphabetically by name
        templates.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
        
        // Populate both dropdowns
        var selectors = ['#templateSelectorMain', '#templateSelectorSide'];
        selectors.forEach(function(selector) {
            var dropdown = $(selector);
            // Keep the Manual option
            dropdown.find('option:not([value="manual"])').remove();
            
            // Add template options
            templates.forEach(function(template) {
                dropdown.append($('<option>', {
                    value: template.value,
                    text: template.name
                }));
            });
        });
        
    } catch (e) {
        alert('Error loading templates: ' + e.message + '\nUsing fallback templates.');
        // Fallback: add hardcoded templates
        var fallbackTemplates = [
            { value: 'martin_wp', name: 'Martin Audio WP' },
            { value: 'martin', name: 'Martin Audio WP - JSON' },
            { value: 'jbl_vtx', name: 'JBL VTX' },
            { value: 'lacoustics', name: 'L-Acoustics K Series' }
        ];
        
        var selectors = ['#templateSelectorMain', '#templateSelectorSide'];
        selectors.forEach(function(selector) {
            var dropdown = $(selector);
            dropdown.find('option:not([value="manual"])').remove();
            
            fallbackTemplates.forEach(function(template) {
                dropdown.append($('<option>', {
                    value: template.value,
                    text: template.name
                }));
            });
        });
    }
}

// Initialize template selectors
$(document).ready(function() {
    // Populate template dropdowns from templates folder
    populateTemplateSelectors();
    
    // Array 1 (Main) template selector
    $('#templateSelectorMain').change(function() {
        var selected = $(this).val();
        
        if (selected === 'manual') {
            resetTemplate('main');
        } else if (selected) {
            loadTemplate(selected, 'main');
        }
    });
    
    // Array 2 (Side) template selector
    $('#templateSelectorSide').change(function() {
        var selected = $(this).val();
        
        if (selected === 'manual') {
            resetTemplate('side');
        } else if (selected) {
            loadTemplate(selected, 'side');
        }
    });
});
