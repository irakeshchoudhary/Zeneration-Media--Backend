import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    business: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    goal: {
        type: String,
        default: '',
        trim: true,
    },
}, { collection: 'leads', timestamps: true });

const Lead = mongoose.model('Lead', LeadSchema);
export default Lead; 