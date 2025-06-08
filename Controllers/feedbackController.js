import Feedback from '../Model/Feedback.js';
import Lead from '../Model/Leadschema.js';

export const submitFeedback = async (req, res) => {
    try {
        const { category, emojiRating, feedbackText, userEmail } = req.body;

        // Basic validation
        if (!category || !emojiRating) {
            return res.status(400).json({ message: 'Category and emoji rating are required.' });
        }

        let userName = 'Unknown';
        let userPhone = 'Unknown';
        let userBusiness = 'Unknown';

        // Try to find the user in the Lead collection if an email is provided and not 'unknown'
        if (userEmail && userEmail !== 'unknown') {
            const lead = await Lead.findOne({ email: userEmail });
            if (lead) {
                userName = lead.name || 'Unknown';
                userPhone = lead.phone || 'Unknown';
                userBusiness = lead.business || 'Unknown';
            }
        }

        // Prepare the current feedback submission object
        const currentSubmission = {
            category,
            emojiRating,
            feedbackText,
            submittedAt: new Date(), // Timestamp for this specific submission
        };

        // Find an existing feedback document for the user email
        let feedbackDoc = await Feedback.findOne({ userEmail: userEmail || 'unknown' });

        if (feedbackDoc) {
            // If document exists, update it
            feedbackDoc.feedbackCount += 1;
            feedbackDoc.feedbackHistory.push(currentSubmission);
            // Update user details if they were 'Unknown' and new info is available
            if (feedbackDoc.userName === 'Unknown' && userName !== 'Unknown') feedbackDoc.userName = userName;
            if (feedbackDoc.userPhone === 'Unknown' && userPhone !== 'Unknown') feedbackDoc.userPhone = userPhone;
            if (feedbackDoc.userBusiness === 'Unknown' && userBusiness !== 'Unknown') feedbackDoc.userBusiness = userBusiness;

            await feedbackDoc.save();
            res.status(200).json({ message: 'Feedback updated successfully!', feedback: feedbackDoc });
        } else {
            // If no document exists, create a new one
            const newFeedback = new Feedback({
                userEmail: userEmail || 'unknown',
                userName,
                userPhone,
                userBusiness,
                feedbackCount: 1,
                feedbackHistory: [currentSubmission],
            });

            await newFeedback.save();
            res.status(201).json({ message: 'Feedback submitted successfully!', feedback: newFeedback });
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        // Check for duplicate key error (userEmail unique constraint)
        if (error.code === 11000) {
            return res.status(409).json({ message: 'A feedback entry already exists for this email. Please update the existing one.' });
        }
        res.status(500).json({ message: 'Server error. Could not submit feedback.' });
    }
}; 