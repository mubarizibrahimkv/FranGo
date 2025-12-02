import mongoose from "mongoose";
import logger from "../logger";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect("mongodb://localhost:27017/frango");
        logger.info(`conncted ${connect.connection.host}`);
    } catch (error) {
        logger.error("monogo db connecting error", error);
        return;
    }
};

export default connectDB;