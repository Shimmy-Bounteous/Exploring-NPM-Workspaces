import mongoose, { Schema } from 'mongoose';
import User from '../types/userType';

const userSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: false,
        default: null
    },
    phoneNo: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        // unique doesn't validate whether there's a duplicate. It just provides some performance benefits
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
});

const Users = mongoose.model<User>('Users', userSchema);
export default Users;