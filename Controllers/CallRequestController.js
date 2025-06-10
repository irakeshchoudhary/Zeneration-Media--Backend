import CallRequest from '../Model/CallRequests.js';
import { appendCallRequestData } from '../Services/googleSheetService.js';

// Helper to check if 5 minutes have passed
const FIVE_MINUTES = 5 * 60 * 1000;

export const createCallRequest = async (req, res) => {
    try {
        const { name, number } = req.body;

        // Validation: name and number must not be blank or contain spaces
        if (!name || !number || name.trim() === '' || number.trim() === '') {
            return res.status(400).json({ error: 'Name and number are required.' });
        }
        if (/\s/.test(number)) {
            return res.status(400).json({ error: 'Number cannot contain spaces.' });
        }
        if (!/^([6-9]{1}[0-9]{9})$/.test(number)) {
            return res.status(400).json({ error: 'Please enter a valid Indian mobile number (10 digits, starts with 6-9, no spaces).' });
        }

        // Check for recent request from this number
        const lastRequest = await CallRequest.findOne({ number }).sort({ createdAt: -1 });
        if (lastRequest) {
            const now = Date.now();
            const lastTime = new Date(lastRequest.createdAt).getTime();
            if (now - lastTime < FIVE_MINUTES) {
                return res.status(429).json({ error: 'Request already sent via this number. Try again after 5 minutes.' });
            } else {
                return res.status(429).json({ error: 'Request already sent via this number. Please use another number to send a new request.' });
            }
        }

        // Create new call request
        const newRequest = new CallRequest({ name: name.trim(), number: number.trim() });
        await newRequest.save();

        // Append to Google Sheet
        try {
            await appendCallRequestData({ name: name.trim(), number: number.trim() });
        } catch (sheetError) {
            console.error('Error syncing to Google Sheet:', sheetError);
            // Continue with success response even if sheet sync fails
        }

        return res.status(201).json({ message: 'Call request submitted successfully.' });
    } catch (err) {
        return res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

// For timer: get last request time for a number
export const getLastRequestTime = async (req, res) => {
    try {
        const { number } = req.query;
        if (!number) return res.status(400).json({ error: 'Number is required.' });
        const lastRequest = await CallRequest.findOne({ number }).sort({ createdAt: -1 });
        if (!lastRequest) return res.json({ lastRequestTime: null });
        return res.json({ lastRequestTime: lastRequest.createdAt });
    } catch (err) {
        return res.status(500).json({ error: 'Server error.' });
    }
}; 