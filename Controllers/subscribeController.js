import User from '../Model/User.js';

export const subscribeUser = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'This email is already subscribed.' });
        }
        // Create new user
        const user = new User({ email, isSubscribed: true });
        await user.save();
        return res.status(201).json({ message: 'Thank you for subscribing!' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}; 