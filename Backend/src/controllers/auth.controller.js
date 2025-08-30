import { upsertStreamUser } from "../db/stream.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessTokenAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findOne(userId);
        
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})

        console.log("I am in the generation function and about to send these",accessToken,refreshToken);
        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"Galti hai kuch tw bhaisaaab Generate na hoke de rha ye tw ")
    }
}

const signup = asyncHandler(async (req,res)=>{
    const {email,password,fullName} = req.body;

    console.log("body ",req.body);
    console.log("hello ",password)

    if (
        [email,password,fullName].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    if (password.length<6){
        console.log("Bhes ki error")
        throw new ApiError(400,"Password must be at least 6 characters")
    }


    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!regex.test(email)) throw new ApiError(400,"Please enter valid Email");

    const existingUser = await User.findOne({
        $or:[{email},{fullName}]
    })

    if(existingUser) throw new ApiError(409,"User with specified email or name already exists.");

    const idx = Math.floor((Math.random()*100)+1);

    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

    const newUser = await User.create({
        fullName,
        email,
        password,
        profilePic: randomAvatar
    })

    const streamUser = await upsertStreamUser({
        id:newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || ""
    })
    console.log("Iske baad bhi ",streamUser)

    if(!streamUser){
        await User.findByIdAndDelete(newUser._id)
        throw new ApiError(500,"Internal Error, Please try again");
    }
    console.log("Stream user is created SUccessfully.",streamUser);

    const {accessToken,refreshToken} =  await generateAccessTokenAndRefreshToken(newUser._id);

    const options = {
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" // prevents from csrf attacks 
    }

    return res.status(201)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{
            newUser,accessToken,refreshToken
        },"User Created Successfully")
    )
    
})

const login = asyncHandler(async (req,res)=>{
    const {email , password} = req.body;

    if (!email || !password) throw new ApiError(400,"All fields are required")


    const user = await User.findOne({email})
    if (!user) throw new ApiError(400,"Invalid Email or pass")
        console.log("Ye tw hauuu ",password,user)
    const passCheck = await user.isPasswordCorrect(password);

    if (!passCheck) throw new ApiError(400,"Invalid Email or pass");

     const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const {accessToken,refreshToken} =  await generateAccessTokenAndRefreshToken(user?._id);

    const options ={
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7*24*60*60*1000,
        sameSite: "strict" // prevents from csrf attacks 
    }

    console.log("Logged In ",loggedInUser)
     return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,accessToken,refreshToken
                },
                "User Logged In Successfully"
            )
        )
})

const logout = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },{
            new:true 
        }
    )

    const options ={
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" // prevents from csrf attacks 
    }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(
        new ApiResponse(200,{},"User Logged Out Successfully")
    )
})

const onboard = asyncHandler(async (req,res)=>{
    const userId = req.user?._id;

    const {fullName,bio,nativeLanguage,learningLanguage,location} = req.body; 

    if(
        [fullName,bio,nativeLanguage,learningLanguage,location].some((field)=> field?.trim()==="")
    ){
        throw new ApiError(400,"All Fields Are required.")
    }

    const updatedUser = await User.findByIdAndUpdate(userId,{
        ...req.body,
        isOnboarded:true
    },{
        new:true
    })

    if(!updatedUser) throw new ApiError(404,"User not found.");

    try {
        await upsertStreamUser({
            id: updatedUser?._id.toString(),
            name: updatedUser?.fullName,
            image: updatedUser?.profilePic || ""
        })
        console.log('User updated after onboarding..')
    } catch (error) {
        console.log("Stream user was not able to update",error.message)
    }

    res.status(200).json(
        new ApiResponse(200,updatedUser,"User updated Successfully.")
    )
})



export {
    signup,
    login,
    logout,
    onboard
}