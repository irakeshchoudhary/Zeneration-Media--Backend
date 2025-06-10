import Lead from '../Model/Leadschema.js';
import { appendLeadData, testGoogleSheetsConnection } from '../Services/googleSheetService.js';

// Test route to verify Google Sheets connection
export const testConnection = async (req, res) => {
    try {
        const isConnected = await testGoogleSheetsConnection();
        if (isConnected) {
            return res.status(200).json({ message: 'Successfully connected to Google Sheets!' });
        } else {
            return res.status(500).json({ message: 'Failed to connect to Google Sheets' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error testing connection', error: error.message });
    }
};

export const createLead = async (req, res) => {
    try {
        const { name, business, phone, email, goal } = req.body;

        // Helper functions
        const isEmptyOrSpaces = (str) => !str || str.trim().length === 0;
        const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isValidIndianPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

        // Validation
        if ([name, business, phone, email].some(isEmptyOrSpaces)) {
            return res.status(400).json({ message: 'All fields except goal/website are required and cannot be empty.' });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address.' });
        }
        if (!isValidIndianPhone(phone)) {
            return res.status(400).json({ message: 'Please enter a valid Indian mobile number.' });
        }

        // Check for duplicates
        const existingLead = await Lead.findOne({ $or: [{ email }, { phone }] });
        if (existingLead) {
            return res.status(409).json({ message: 'This email or phone number is already registered.' });
        }

        // Save to DB
        const lead = new Lead({ name, business, phone, email, goal });
        await lead.save();

        console.log('MongoDB save successful, attempting to append to Google Sheets...');

        // Append to Google Sheet
        try {
            await appendLeadData({ name, business, phone, email, goal });
            console.log('Successfully synced lead data to Google Sheets');
        } catch (sheetError) {
            console.error('Error syncing to Google Sheet:', sheetError);
            // Continue with success response even if sheet sync fails
        }

        return res.status(201).json({ message: 'Thank you! Our team will contact you soon.' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}; 