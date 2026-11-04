
import {
  extractSpreadsheetId,
  getSheetData
} from "../Services/googleSheetsService.js";

export const previewSheet = async (req, res) => {
  try {
    const { url, sheetName } = req.body;

    if (!url || !sheetName) {
      return res.status(400).json({
        success: false,
        message: "Google Sheet URL and worksheet name are required"
      });
    }

    // Validate Google Sheets URL
    const parsedUrl = new URL(url);

    if (
      parsedUrl.hostname !== "docs.google.com" ||
      !parsedUrl.pathname.startsWith("/spreadsheets/d/")
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid Google Sheets URL"
      });
    }

    // Extract spreadsheet ID
    const spreadsheetId = extractSpreadsheetId(url);

    // Fetch spreadsheet data
    const data = await getSheetData(
      spreadsheetId,
      sheetName
    );

    res.status(200).json({
      success: true,
      message: "Google Sheet connected successfully",
      data
    });

  } catch (error) {
    console.error("Google Sheets Error:", error.message);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
