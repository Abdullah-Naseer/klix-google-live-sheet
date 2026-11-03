
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,

  scopes: [
    "https://www.googleapis.com/auth/spreadsheets.readonly"
  ]
});

const googleSheets = google.sheets({
  version: "v4",
  auth
});

// Extract spreadsheet ID from URL
export const extractSpreadsheetId = (url) => {
  const match = url.match(
    /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/
  );

  if (!match) {
    throw new Error("Invalid Google Sheets URL");
  }

  return match[1];
};

// Fetch spreadsheet records
export const getSheetData = async (
  spreadsheetId,
  sheetName
) => {

  const escapedSheetName = sheetName.replace(/'/g, "''");

  const range = `'${escapedSheetName}'!A:Z`;

  const response = await googleSheets.spreadsheets.values.get({
    spreadsheetId,
    range
  });

  const rows = response.data.values || [];

  if (rows.length === 0) {
    return {
      headers: [],
      records: []
    };
  }

  const headers = rows[0].map((header, index) => {
    return String(header).trim() || `Column ${index + 1}`;
  });

  const records = rows.slice(1).map((row) => {
    const record = {};

    headers.forEach((header, index) => {
      record[header] = row[index] ?? "";
    });

    return record;
  });

  return {
    headers,
    records
  };
};
