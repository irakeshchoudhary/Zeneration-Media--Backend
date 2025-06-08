import Feedback from '../Model/Feedback.js';

export const submitFeedback = async (req, res) => {
    try {
        const { category, emojiRating, feedbackText } = req.body;

        // Basic validation
        if (!category || !emojiRating) {
            return res.status(400).json({ message: 'Category and emoji rating are required.' });
        }

        const newFeedback = new Feedback({
            category,
            emojiRating,
            feedbackText,
        });

        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully!', feedback: newFeedback });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Server error. Could not submit feedback.' });
    }
}; 