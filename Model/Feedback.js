import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['Website', 'Services', 'Social Media', 'Others'],
    },
    emojiRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    feedbackText: {
        type: String,
        trim: true,
        default: '',
    },
    userEmail: {
        type: String,
        trim: true,
        default: 'unknown',
    },
    userName: {
        type: String,
        trim: true,
        default: 'Unknown',
    },
    userPhone: {
        type: String,
        trim: true,
        default: 'Unknown',
    },
    userBusiness: {
        type: String,
        trim: true,
        default: 'Unknown',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback; 