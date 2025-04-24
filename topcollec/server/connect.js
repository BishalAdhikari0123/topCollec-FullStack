import { config } from "dotenv";
import mongoose from "mongoose";

config();

const connectToMongoDB = () => {
    return mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("✅ Connected to MongoDB successfully!!");
    })
    .catch((err) => {
        console.error("❌ Failed to connect to MongoDB:", err);
        process.exit(1);
    });
};

export default connectToMongoDB;
