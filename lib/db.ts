import mongoose, { mongo } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    if(connectionState === 1){
        console.log("Already connected.");
        return;
    }

    if(connectionState === 2){
        console.log("Connecting to MongoDB...");
        return;
    }
    
    try{
        mongoose.connect(MONGODB_URI!, {
            dbName: "restapi-mongodb",
            bufferCommands: true

        });
    }catch(err: any){
        console.log("Error: ", err);
        throw new Error("Error: ", err);
    }
}