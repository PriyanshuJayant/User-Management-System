import mongoose, { Schema, Model } from 'mongoose';
import { IEntry } from '../types';

const entrySchema = new Schema<IEntry>({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    fullName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    age: {
        type: Number,
        required: true,
        min: 1,
        max: 120,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other'],
    }
}, { timestamps: true });

const Entries: Model<IEntry> = mongoose.model<IEntry>('data', entrySchema);

export default Entries;
