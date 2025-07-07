import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', ()=> console.log("Database conected"));

    await mongoose.connect(`${process.env.MONGODB_URL}/garment-factory-management-system`);
};

export default connectDB;