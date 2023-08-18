import mongoose from 'mongoose';

// Connecting to MongoDB Atlas
const connectDB = async () => {
    try {
        if (!process.env.DB_URL)
            throw new Error('DB_URL not available');
        else {
            // const options: ConnectOptions = {
            //     useNewUrlParser: true,
            //     useUnifiedTopology: true
            // };
            await mongoose.connect(process.env.DB_URL);
            console.log('Connected to MongoDB Atlas');
        }

    } catch (error) {
        console.error('Failed to connect to MongoDB Atlas', error);
        process.exit(1);
    }
}

export default connectDB;