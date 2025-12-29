/**
 * ANALYTICS COMPANION TESTING - GOOGLE APPS SCRIPT
 *
 * This script receives form submissions from the chapter-specific testing forms
 * and writes them to a Google Sheet.
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet with name: "Analytics Companion Test Results"
 * 2. Go to Extensions > Apps Script
 * 3. Paste this entire code
 * 4. Replace SPREADSHEET_ID with your actual spreadsheet ID
 * 5. Click Deploy > New Deployment > Web App
 * 6. Set "Execute as" to "Me" and "Who has access" to "Anyone"
 * 7. Copy the deployment URL and paste it into each HTML form
 */

// Replace with your actual spreadsheet ID (found in the URL)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

/**
 * Handle POST requests from the testing forms
 */
function doPost(e) {
  try {
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Open or create the appropriate sheet for the chapter
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const chapter = data.chapter || 'Unknown';
    let sheet = ss.getSheetByName(chapter);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(chapter);
      // Add header row based on the data received
      const headers = Object.keys(data);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }

    // Get headers from first row
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Check if we need to add new columns for new fields
    const dataKeys = Object.keys(data);
    const newKeys = dataKeys.filter(key => !headers.includes(key));

    if (newKeys.length > 0) {
      // Add new headers
      for (let i = 0; i < newKeys.length; i++) {
        sheet.getRange(1, headers.length + 1 + i).setValue(newKeys[i]);
      }
      // Refresh headers
      headers.push(...newKeys);
    }

    // Build row data in header order
    const rowData = headers.map(header => data[header] || '');

    // Append the row
    sheet.appendRow(rowData);

    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log error and return failure
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput('Analytics Companion Test Receiver is running. POST to submit test results.')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Test function - run this manually to verify sheet access
 */
function testAccess() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log('Successfully accessed spreadsheet: ' + ss.getName());

    // Create test sheets
    const chapters = ['General', 'Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4'];
    chapters.forEach(chapter => {
      let sheet = ss.getSheetByName(chapter);
      if (!sheet) {
        sheet = ss.insertSheet(chapter);
        Logger.log('Created sheet: ' + chapter);
      } else {
        Logger.log('Sheet exists: ' + chapter);
      }
    });

    Logger.log('Test completed successfully!');
  } catch (error) {
    Logger.log('Error: ' + error.toString());
  }
}

/**
 * Initialize sheets with headers (run once after setup)
 */
function initializeSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // Common headers for all chapters
  const commonHeaders = [
    'timestamp',
    'testerName',
    'testerEmail',
    'testDate',
    'companion',
    'chapter'
  ];

  // General tests headers
  const generalHeaders = [
    ...commonHeaders,
    'test_G1', 'notes_G1',  // Welcome
    'test_G2', 'notes_G2',  // Mode Detection Example
    'test_G3', 'notes_G3',  // Mode Detection Exercise
    'test_G4', 'notes_G4',  // Stage Sequence
    'test_G5', 'notes_G5',  // Causal Language
    'test_G6', 'notes_G6',  // Selection Bias
    'test_G7', 'notes_G7',  // Tone
    'test_G8', 'notes_G8',  // Stage Prohibitions
    'workedWell',
    'needsImprovement',
    'bugs'
  ];

  // Chapter 1 headers
  const ch1Headers = [
    ...commonHeaders,
    'test_1E1', 'notes_1E1',  // Representation
    'test_1E2', 'notes_1E2',  // Unit of Analysis
    'test_1E3', 'notes_1E3',  // Selection Bias
    'test_1E4', 'notes_1E4',  // Proxy
    'test_1E5', 'notes_1E5',  // Association vs Causation
    'test_1X1', 'notes_1X1',  // Exercise Unit
    'test_1X3', 'notes_1X3',  // Exercise Proxy
    'test_1X4', 'notes_1X4',  // Exercise Alternatives
    'test_1T1', 'notes_1T1',  // Trap Data-as-Truth
    'test_1T2', 'notes_1T2',  // Trap Unit Confusion
    'test_1T3', 'notes_1T3',  // Trap Proxy Face Value
    'workedWell',
    'needsImprovement',
    'bugs'
  ];

  // Chapter 2 headers
  const ch2Headers = [
    ...commonHeaders,
    'test_2E1', 'notes_2E1',  // Business Understanding
    'test_2E3', 'notes_2E3',  // Selection Bias
    'test_2E5', 'notes_2E5',  // Coefficient Interpretation
    'test_2E7', 'notes_2E7',  // Interpretation with Uncertainty
    'test_2T1', 'notes_2T1',  // Trap Coefficient-as-Lever
    'test_2T1b', 'notes_2T1b', // Trap Coefficient LSTAT
    'test_2T3', 'notes_2T3',  // Trap Diagnostics-as-Approval
    'test_2X2', 'notes_2X2',  // Exercise Coefficient
    'test_2X3', 'notes_2X3',  // Exercise Performance
    'workedWell',
    'needsImprovement',
    'bugs'
  ];

  // Chapter 3 headers
  const ch3Headers = [
    ...commonHeaders,
    'test_3E3', 'notes_3E3',  // Selection on Outcome
    'test_3E6', 'notes_3E6',  // Probabilities Not Labels
    'test_3E7', 'notes_3E7',  // Metrics Explanation
    'test_3E8', 'notes_3E8',  // Threshold as Business Decision
    'test_3T1', 'notes_3T1',  // Trap Accuracy Celebration
    'test_3T2', 'notes_3T2',  // Trap Label Fixation
    'test_3T3', 'notes_3T3',  // Trap Default Threshold
    'test_3T4', 'notes_3T4',  // Trap Metric Absolutism
    'workedWell',
    'needsImprovement',
    'bugs'
  ];

  // Chapter 4 headers
  const ch4Headers = [
    ...commonHeaders,
    'test_4E1', 'notes_4E1',  // Business Understanding
    'test_4E4', 'notes_4E4',  // Feature Engineering
    'test_4E5', 'notes_4E5',  // Scaling
    'test_4E7', 'notes_4E7',  // Choosing K
    'test_4E8', 'notes_4E8',  // Cluster Interpretation
    'test_4T1', 'notes_4T1',  // Trap Reification
    'test_4T2', 'notes_4T2',  // Trap Feature Blindness
    'test_4T4', 'notes_4T4',  // Trap Metric Worship
    'test_4X3', 'notes_4X3',  // Exercise Choosing K
    'test_4X4', 'notes_4X4',  // Exercise Naming
    'workedWell',
    'needsImprovement',
    'bugs'
  ];

  // Create/update sheets with headers
  const sheetsConfig = [
    { name: 'General', headers: generalHeaders },
    { name: 'Chapter 1', headers: ch1Headers },
    { name: 'Chapter 2', headers: ch2Headers },
    { name: 'Chapter 3', headers: ch3Headers },
    { name: 'Chapter 4', headers: ch4Headers }
  ];

  sheetsConfig.forEach(config => {
    let sheet = ss.getSheetByName(config.name);
    if (!sheet) {
      sheet = ss.insertSheet(config.name);
    }
    // Clear and set headers
    sheet.clear();
    sheet.appendRow(config.headers);
    sheet.getRange(1, 1, 1, config.headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);

    Logger.log('Initialized sheet: ' + config.name + ' with ' + config.headers.length + ' columns');
  });

  Logger.log('All sheets initialized successfully!');
}
