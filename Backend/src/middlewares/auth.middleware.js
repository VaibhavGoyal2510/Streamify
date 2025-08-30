import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"


const verifyJwt = asyncHandler(async (req,res,next)=>{
    try {
        // console.log("Cookie hai",req.cookies.accessToken)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if (!token) throw new ApiError(401,"Unauthorized")

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        if(!decodedToken) throw new ApiError(401,"Na bhaiya Gadbad hai - Invalid Token");

        const user= await User.findById(decodedToken._id).select("-password -refreshToken");

        if(!user) throw new ApiError(401,"Na bhaiya Gadbad hai");

        req.user = user;

        next();
    } catch (error) {
        console.log(error)
        throw new ApiError(500,"Error while verifyingggg.......");
    }
})


export {verifyJwt}