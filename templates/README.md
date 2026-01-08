# RSD Template System

## Overview
The template system allows you to create custom configurations for different PA manufacturers and rigging requirements. Templates are stored as JSON files in the `templates/` folder.

## Template File Formats

Templates can be created in two formats:

### Format 1: JSON (Recommended for complex templates)
### Format 2: Text (.txt) - Simple and easy to edit

## JSON Template Structure

Each JSON template has the following structure:

```json
{
  "name": "Template Name",
  "description": "Description of the template",
  "paColumns": {
    "type": true,
    "circuit": true
  },
  "rigging": [
    {
      "label": "LABEL TEXT",
      "unit": "m",
      "visible": true,
      "placeholder": "Optional placeholder text",
      "colspan": false,
      "toggleId": "optional-toggle-id"
    }
  ]
}
```

## Text Template Structure (.txt)

Text templates use a simple key=value format:

```
# Lines starting with # are comments

# Template Information
name=Template Name
description=Description text

# PA Table Columns
type=true
circuit=false

# Rigging Table Rows
# Format: rigcell=LABEL | unit | visible | placeholder | colspan | toggleId
rigcell=FRAME ANGLE | ° | true
rigcell=TRIM - TOP | m | true
rigcell=EXTENSION BAR | FALSE | true | A/B/C or BLANK | true
rigcell=TOTAL LOAD | kg | true
```

**Text Format Rules:**
- Lines starting with `#` are comments
- `name=` sets the template name
- `description=` sets the description
- `type=true/false` - show/hide Type column
- `circuit=true/false` - show/hide Circuit column
- `rigcell=` defines a rigging row with pipe-separated values:
  - `LABEL` - Text for the row label
  - `unit` - Unit text (use FALSE for no unit)
  - `visible` - true/false for default visibility
  - `placeholder` - (optional) placeholder text
  - `colspan` - (optional) true to span input across columns
  - `toggleId` - (optional) singlePoint or trimStage for toggle control

## Configuration Options

### PA Columns (`paColumns`)
Controls which columns are visible in the PA tables:

- **`type`**: `true` to show Type column, `false` to hide
- **`circuit`**: `true` to show Circuit column, `false` to hide

### Rigging Rows (`rigging`)
Array of rigging table rows. Each row has:

- **`label`** (required): Text shown in the left cell (e.g., "FRAME ANGLE", "TRIM - TOP")
- **`unit`** (required): Unit shown in the right cell (e.g., "m", "kg", "°"). Use `false` for no unit cell
- **`visible`** (required): `true` to show by default, `false` to hide by default
- **`placeholder`** (optional): Placeholder text for the input field
- **`colspan`** (optional): `true` to make input span both input and unit columns (for text entries)
- **`toggleId`** (optional): ID for rows that can be toggled via sidebar checkboxes (e.g., "singlePoint", "trimStage")

## Creating a New Template

1. Create a new JSON file in the `templates/` folder (e.g., `mytemplate.json`)

2. Define your configuration:

```json
{
  "name": "My Custom Template",
  "description": "Custom configuration for XYZ PA system",
  "paColumns": {
    "type": false,
    "circuit": true
  },
  "rigging": [
    {
      "label": "FRAME ANGLE",
      "unit": "°",
      "visible": true
    },
    {
      "label": "TRIM - TOP",
      "unit": "m",
      "visible": true
    },
    {
      "label": "EXTENSION BAR",
      "unit": false,
      "visible": true,
      "placeholder": "A/B/C or BLANK"
    },
    {
      "label": "TOTAL LOAD",
      "unit": "kg",
      "visible": true
    }
  ]
}
```

3. Add your template to the dropdown in `main.html`:

```html
<option value="mytemplate">My Custom Template</option>
```

## Example Templates

### Generic Template
- Shows Type and Circuit columns
- Standard rigging fields
- Optional Single Point and Trim-Stage toggles

### Martin Audio WP Template
- Shows Type column only (no Circuit)
- Includes Extension Bar field
- Standard load calculations

### JBL VTX Template
- Shows Circuit column only (no Type)
- Includes Trim-Stage field by default
- Standard rigging fields

## Usage

1. Select a template from the dropdown in the sidebar
2. The PA table columns and rigging table will automatically adjust
3. When a template is active, manual column toggles are disabled
4. Select "Manual" to regain manual control over columns

## Notes

- Units use HTML entities: `°` for degrees, standard text for m, kg, etc.
- Rows with `toggleId` can be shown/hidden via sidebar checkboxes
- The `colspan` option is useful for text entry fields that don't need a unit
- Templates apply to both Array 1 and Array 2 simultaneously
