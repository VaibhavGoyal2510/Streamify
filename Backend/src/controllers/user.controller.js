import FriendRequest from "../models/friendRequest.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getRecommendedUsers= asyncHandler(async(req,res)=>{
    const currentUserId =req.user?._id;  //id also works 
    const currentUser =req.user;

    const recommendedUsers = await User.find({
        $and:[
            {_id:{$ne: currentUserId}}, // exclude current user
            {_id: {$nin: currentUser.friends}}, //exclude current user friends
            {isOnboarded: true}
        ]
    })

    return res.status(200).json(recommendedUsers)
})

const getMyFriends = asyncHandler(async (req,res)=>{

    const user =await User.findById(req.user?._id).select("friends")
    .populate("friends", "fullName profilePic nativeLanguage learningLanguage") // to get all fields of these individual friends, instead of just getting the id's of these friends [we had array of friends]

    return res.status(200).json(
        user.friends
    )
})

const sendFriendRequest  = asyncHandler(async(req,res)=>{

    const myId = req.user?._id;

    const { id: receipientId }=req.params
    //prevent sending req to yourself

    if (myId===receipientId) throw new ApiError(400,"U can't send req to urself")


    const receipient = await User.findById(receipientId);
     
    if(!receipient) throw new ApiError(404,"No user with id present")

    if(receipient.friends.includes(myId)) throw new ApiError(400,"You are already Friends with User")


    // Check if req already exists
    const existingRequest = await FriendRequest.find({
        $or:[
            {sender:myId, recipient:receipientId},
            {sender: receipientId, receipient:myId}
        ]
    })
    console.log("ye meri bheji hui hai tw ",existingRequest);
    if([].length>0) console.log("yashu di balle balle")
    if(existingRequest.length>0) throw new ApiError(400,"A friend request already exists between you and this user")


    const friendRequest = await FriendRequest.create({
        sender:myId,
        recipient: receipientId
    })

    return res.status(201).json(friendRequest);
})


const acceptFriendRequest = asyncHandler(async (req,res)=>{
    const {id:requestId} = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if(!friendRequest) throw new ApiError(401,"Friend Request Not Found");

    // Verify if the current user is the receipient
    console.log("Freienjvnsdjncvs ",req.user)
    if(friendRequest.recipient.toString() !== req.user?.id) {
        throw new ApiError(403,"You are not authorized to accept the request")
    }

    friendRequest.status = "accepted";
    await friendRequest.save();


    //add each other as friends 
    await User.findOneAndUpdate(friendRequest.sender,{
        $addToSet: {friends: friendRequest.recipient}      
    })

    await User.findOneAndUpdate(friendRequest.recipient,{
        $addToSet: {friends: friendRequest.sender}      
    })

    return res.status(200).json(
        new ApiResponse(200,{},"Friend Request accepted")
    )
})

const getFriendRequest = asyncHandler(async(req,res)=>{
    console.log("user ",req.user._id)
    const incomingRequests = await FriendRequest.find({
        recipient: req.user?._id,
        status: "pending"
    }).populate("sender","fullName profilePic nativeLanguage learningLanguage");

    const acceptedRequests = await FriendRequest.find({
        sender: req.user?._id,
        status: "accepted"     
    }).populate("recipient","fullName profilePic")

    console.log("Kya hua ",incomingRequests,acceptedRequests)

    return res.status(200).json({incomingRequests,acceptedRequests})

})

const getOutgoingFriendRequests = asyncHandler(async ( req,res)=>{
    const outGoingReq = await FriendRequest.find({
        sender:req.user?._id,
        status:"pending"
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    return res.status(200).json(outGoingReq);
})


export {
    getMyFriends,
    getRecommendedUsers,
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequest,
    getOutgoingFriendRequests
}