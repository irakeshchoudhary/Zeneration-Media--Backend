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

        const newFeedback = new Feedback({
            category,
            emojiRating,
            feedbackText,
            userEmail: userEmail || 'unknown',
            userName,
            userPhone,
            userBusiness,
        });

        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully!', feedback: newFeedback });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Server error. Could not submit feedback.' });
    }
}; 