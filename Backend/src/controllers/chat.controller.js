import { generateStreamToken } from "../db/stream.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getStreamToken = asyncHandler(async (req,res)=>{
    const token = generateStreamToken(req.user?._id);

    return res.status(200).json({token});
})

export {
    getStreamToken
}