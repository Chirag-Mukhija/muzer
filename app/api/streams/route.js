import { NextResponse , nextUrl} from "next/server";
import { object, string } from "zod";
import prismaClient from "@/lib/db";
import { is } from "zod/locales";
const yt_regex = new RegExp("^(https?\\:\\/\\/)?(www\\.youtube\\.com|youtu\\.?be)\\/.+$","i");
// this maybe a chutiyaap , check later if it breaks ; 
function extractIdFromUrl(url) {
    if (url.includes('youtu.be')) {
        return url.split('youtu.be/')[1].split('?')[0];
    }
    if (url.includes('youtube.com')) {
        return url.split('v=')[1].split('&')[0];
    }
    return null;
}

const streamSchema = object({
    userId : string(),
    url : string()
})

export async function POST(request) {
    const body = await request.json();
    try{
        const parsedData = streamSchema.parse(body);
    }catch(error){
        return NextResponse.json({error: "Error while adding a stream, invalid request body"}, {status: 400});
    }
    //user id aa rha hai , or youtube ka link aa rha hai through post request on streams 
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
                extractedId : extractIdFromUrl(url)
            }
        });
        return NextResponse.json(stream);
    } catch (error) {
        return NextResponse.json({error: "Error while adding a stream"}, {status: 500});
    }

}
export async function GET(request){
    const creatorId = await request.nextUrl.searchParams.get("creatorId");
    const streams = await prismaClient.stream.findMany({
        where : {
            userId : creatorId 
        }
    })
    return NextResponse.json({streams : streams})
} 
