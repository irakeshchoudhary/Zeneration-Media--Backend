import mongoose from 'mongoose';

const callRequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        validate: {
            validator: function (v) {
                return v && v.trim().length > 0;
            },
            message: 'Name cannot be blank.'
        }
    },
    number: {
        type: String,
        required: [true, 'Number is required'],
        unique: false,
        validate: [
            {
                validator: function (v) {
                    // Indian mobile number format: 10 digits, starts with 6-9, no spaces
                    return /^([6-9]{1}[0-9]{9})$/.test(v);
                },
                message: 'Please enter a valid Indian mobile number (10 digits, starts with 6-9, no spaces).'
            },
            {
                validator: function (v) {
                    return !/\s/.test(v);
                },
                message: 'Number cannot contain spaces.'
            }
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // Optional: auto-remove after 1 hour
    }
});

export default mongoose.model('CallRequest', callRequestSchema); 