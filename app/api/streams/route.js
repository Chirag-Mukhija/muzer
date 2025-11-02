import {NextResponse} from "next/server"; 
import * as z from "zod";
import prismaClient from "@/lib/db";
import { is } from "zod/locales";
const yt_regex = new RegExp("^(https?\\:\\/\\/)?(www\\.youtube\\.com|youtu\\.?be)\\/.+$","i");

function extractIdFromUrl(url) {
    if (url.includes('youtu.be')) {
        return url.split('youtu.be/')[1].split('?')[0];
    }
    if (url.includes('youtube.com')) {
        return url.split('v=')[1].split('&')[0];
    }
    return null;
}

const streamSchema = z.object({
    userId : z.string(),
    url : z.string()
})

export async function POST(request) {
    const body = await request.json();
    try{
        const parsedData = streamSchema.parse(body);
    }catch(error){
        return NextResponse.json({error: "Error while adding a stream, invalid request body"}, {status: 400});
    }

    const { userId, url } = parsedData;
    isYt = yt_regex.test(url);
    if(isYt == false){
        return NextResponse.json({error: "Error while adding a stream, invalid youtube url"}, {status: 400});
    }
    try {
        const stream = await prismaClient.stream.create({
            data: {
                userId : userId,
                url : url,
                type : "youtube",
                extractedId : extractIdFromUrl(url)
            }
        });
        return NextResponse.json(stream);
    } catch (error) {
        return NextResponse.json({error: "Error while adding a stream"}, {status: 500});
    }

}