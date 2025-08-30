import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema(
    {
        fullName:{
            type: String,
            required: true 
        },
        email:{
            type: String,
            unique:true,
            required: true 
        },
        password:{
            type: String,
            required: true,
            minlength: 6
        },
        bio:{
            type: String,
            default: ""
        },
        profilePic:{
            type: String,
            default: ""
        },
        nativeLanguage:{
            type: String,
            default: ""
        },
        learningLanguage:{
            type: String,
            default: ""
        },
        location:{
            type: String,
            default: ""
        },
        isOnboarded:{
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String,
        },
        friends:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    }
    ,{timestamps: true});

// pre hook -> before saving users to the database , we will save their password 
userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    console.log(this)
    this.password=await bcrypt.hash(this.password,10);
    next()
})


userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken = function () {
  return jwt.sign({
    _id: this._id,
    email: this.email,
    fullName: this.fullName,
  },process.env.ACCESS_TOKEN_SECRET,{
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  });
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id   
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}
export const User = mongoose.model("User",userSchema);