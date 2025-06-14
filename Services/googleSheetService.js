import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

// Construct credentials object from environment variables
const credentials = {
  type: process.env.GOOGLE_SERVICE_ACCOUNT_TYPE,
  project_id: process.env.GOOGLE_SERVICE_ACCOUNT_PROJECT_ID,
  private_key_id: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace \n with actual newline characters
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
  auth_uri: process.env.GOOGLE_SERVICE_ACCOUNT_AUTH_URI,
  token_uri: process.env.GOOGLE_SERVICE_ACCOUNT_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
  universe_domain: process.env.GOOGLE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN,
};

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Test function to verify Google Sheets connection
export const testGoogleSheetsConnection = async () => {
  try {
    console.log('Testing Google Sheets connection...');
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID is not set in environment variables');
    }

    console.log('Using Spreadsheet ID:', spreadsheetId);

    // Try to read the first sheet
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    console.log('Successfully connected to Google Sheets!');
    console.log('Sheet title:', response.data.properties.title);
    console.log('Available sheets:', response.data.sheets.map(sheet => sheet.properties.title));

    return true;
  } catch (error) {
    console.error('Error testing Google Sheets connection:', error.message);
    if (error.response) {
      console.error('Google API Error Details:', error.response.data);
    }
    return false;
  }
};

// Helper function to format date
const formatDate = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'medium'
  });
};

// Helper function to validate spreadsheet ID
const validateSpreadsheetId = () => {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID is not set in environment variables');
  }
  return spreadsheetId;
};

// Function to append lead data
export const appendLeadData = async (leadData) => {
  try {
    console.log('Attempting to append lead data to sheet:', leadData);
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
    const spreadsheetId = validateSpreadsheetId();
    const range = 'Leads!A:F';

    const values = [[
      leadData.name,
      leadData.business,
      leadData.phone,
      leadData.email,
      leadData.goal || 'N/A',
      formatDate(new Date())
    ]];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    console.log('Successfully appended lead data:', response.data);
  } catch (error) {
    console.error('Error appending lead data to sheet:', error.message);
    if (error.response) {
      console.error('Google API Error Details:', error.response.data);
    }
    throw error;
  }
};

// Function to append call request data
export const appendCallRequestData = async (callData) => {
  try {
    console.log('Attempting to append call request data to sheet:', callData);
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
    const spreadsheetId = validateSpreadsheetId();
    const range = 'CallRequests!A:C';

    const values = [[
      callData.name,
      callData.number,
      formatDate(new Date())
    ]];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    console.log('Successfully appended call request data:', response.data);
  } catch (error) {
    console.error('Error appending call request data to sheet:', error.message);
    if (error.response) {
      console.error('Google API Error Details:', error.response.data);
    }
    throw error;
  }
};

// Function to append feedback data
export const appendFeedbackData = async (feedbackData) => {
  try {
    console.log('Attempting to append feedback data to sheet:', feedbackData);
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
    const spreadsheetId = validateSpreadsheetId();
    const range = 'Feedback!A:G';

    const values = [[
      feedbackData.userName,
      feedbackData.userEmail,
      feedbackData.userPhone,
      feedbackData.userBusiness,
      feedbackData.category,
      feedbackData.emojiRating,
      formatDate(new Date())
    ]];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    console.log('Successfully appended feedback data:', response.data);
  } catch (error) {
    console.error('Error appending feedback data to sheet:', error.message);
    if (error.response) {
      console.error('Google API Error Details:', error.response.data);
    }
    throw error;
  }
};

// Function to append subscriber data
export const appendSubscriberData = async (subscriberData) => {
  try {
    console.log('Attempting to append subscriber data to sheet:', subscriberData);
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
    const spreadsheetId = validateSpreadsheetId();
    const range = 'Subscribers!A:B';

    const values = [[
      subscriberData.email,
      formatDate(new Date())
    ]];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    console.log('Successfully appended subscriber data:', response.data);
  } catch (error) {
    console.error('Error appending subscriber data to sheet:', error.message);
    if (error.response) {
      console.error('Google API Error Details:', error.response.data);
    }
    throw error;
  }
};
