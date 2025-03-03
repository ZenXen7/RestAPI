import { connect } from "@/lib/db";
import Category from "@/lib/modals/category";
import User from "@/lib/modals/users";
import { NextResponse } from "next/server"
import { Types } from "mongoose";
const ObjectId = require("mongoose").Types.ObjectId;




export const GET = async (request: Request) => {
    try {
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");
        
        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message: "Invalid ID or missing User ID"}), {status: 400});
        }

        await connect();

        const user = await User.findById(userId); 
        if(!user){
            return new NextResponse(JSON.stringify({message: "User not found"}), {status: 404});
        }

        const categories = await Category.find({user: new Types.ObjectId(userId)});
        return new NextResponse(JSON.stringify(categories), {status: 200});
    } catch (error: any) {
        return new NextResponse("Error in fetching categories" + error.message, {status: 500,});
    }
};

export const POST = async (request: Request) => {
    try {
        
        const body = await request.json();
        await connect();
        
        const user = await User.findById(body.userId);
    } catch (error: any) {
        
    }
}
