import mongoose from "mongoose";

const connectDB = async()=>{
    try {
       const conn=await mongoose.connect(process.env.MONGO_URI,{
        retryWrites: true,// This option enables retryable writes. 
        // It allows MongoDB to automatically retry write operations (such as inserts and updates) 
        // in case of transient network errors or other issues.
        serverSelectionTimeoutMS:3000,//(3seconds)//This option sets the maximum time (in milliseconds) 
        //that Mongoose will wait for a MongoDB server to be selected before timing out
       });

       console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`error: ${error.message}`)
    }
}

export default connectDB

