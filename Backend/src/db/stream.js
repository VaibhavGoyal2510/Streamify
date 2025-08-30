import { StreamChat } from "stream-chat";
import { asyncHandler } from "../utils/asyncHandler.js";

const apiKey  = process.env.STREAM_API_KEY;
const apiSecret  = process.env.STREAM_API_SECRET;


if (!apiKey|| !apiSecret) console.error("Stream api key is misisiing")

const streamClient = StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async (userData)=>{

   try {
     await streamClient.upsertUsers([userData])
     //upsert means if not there then create , and if already there just update it 
     return userData
   } catch (error) {
    console.log("Error in stream making client",error)
   }
}


export const generateStreamToken = (userID)=>{
  try {
    // ensure userId is string 
    const userIdStr = userID.toString();

    return streamClient.createToken(userIdStr);
  } catch (error) {
    
  }
};