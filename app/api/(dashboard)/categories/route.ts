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
        
      const {searchParams} = new URL(request.url);
      const userId = searchParams.get("userId");;

      const {title} = await request.json();

    
  

   
    
    if(!userId || !Types.ObjectId.isValid(userId)){
        return new NextResponse(JSON.stringify({message: "Invalid ID or missing User ID"}), {status: 400});
    }
    await connect();
    const user = await User.findById(userId);

    if(!user) {
        return new NextResponse(JSON.stringify({message: "User not found"}), {status: 404});
    }
    const newCategory = new Category(
        {
            title, 
            user: new Types.ObjectId(userId),
        }
    );
    await newCategory.save();

    return new NextResponse(JSON.stringify({message: "Category is created", category: newCategory}),
     {status: 200});
     
    } catch (error: any) {
      return new NextResponse("Error in creating category" + error.message, 
        {status: 500,}
      )  
    }
}

export const PATCH = async (request: Request) =>{
    try {
        
        const body = await request.json();
        const {categoryId, newTitle} = body;
        
    
        if(!categoryId || !newTitle) {
            return new NextResponse(JSON.stringify({message: "ID or new title not found."}), {status: 400});
        }

        if(!Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({message: "Invalid ID."}), {status: 400});
        }
       
        await connect();

        const updatedCategory = await Category.findOneAndUpdate(
            {
                _id: new ObjectId(categoryId)
            },
            {
                title: newTitle,
            },
            { new: true }
        
        );
        if (!updatedCategory) {
            return new NextResponse(JSON.stringify({ message: "Category not found." }), { status: 404 });
        }
        
        return new NextResponse(JSON.stringify({message: "User updated successfully", title: updatedCategory}), {status: 200});
    } catch (error: any) {
        return new NextResponse("Error in creating category" + error.message, 
          {status: 500,}
        )  
      }
}



