import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        trim: true,
        required: true,
        unique: true,
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
    feedbackCount: {
        type: Number,
        default: 0,
    },
    feedbackHistory: [
        {
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
            submittedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback; 