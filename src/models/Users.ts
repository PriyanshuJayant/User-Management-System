import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '../types';

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const User: Model<IUser> = mongoose.model<IUser>('user', userSchema);

export default User;
