import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const upvoteSchema = z.object({
    streamId : z.string()
})

export async function POST(request){
    const session = await getServerSession();

    const user = await PrismaClient.user.findUnique({
        where : {
            email : session.user.email 
        }
    })
    if(!user){
        return NextResponse.json({message : "User not logged in"}, {status: 401});
    }
    data =  upvoteSchema.parse(await request.json());
    try{
       const upvote = await PrismaClient.upvote.delete({
        data : {
            userId : user.userId ,
            streamId : data.streamId 
        }
       })
    }catch(e){
        return NextResponse.json({message : "Error creating an upvote"}, {status: 400});
    }
}