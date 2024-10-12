import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser=asyncHandler(async(req,res)=>{

    // res.status(200).json({
    //     message:"sourav"
    // })


    //get user details from frontend
    //validation - not empty
    //check if user already exists:username,email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //remove password and referesh token field from response
    //check for user creation
    //return res

    //form,url
    const {fullName,email,username,password}=req.body
    console.log("email:",email);
    // if(fullName===""){
    //     throw new ApiError(400,"full name required")
    // }
    if(
        [fullName,email,username,password].some((field)=>field?.trim()==="")
    )
    {
        throw new ApiError(400,"All fields are required")
    }
    const existedUser=User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser)
    {
        throw new ApiError(409,"User with email or username already exist")
    }
    //multer gives you filees
    const avatarLocalPath=req.files?.avatar[0]?.path
    const coverImageLocalPath= req.files?.coverImage[0]?.path;
    if(!avatarLocalPath)
    {
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage= await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar)
    {
        throw new ApiError(400,"Avatar file is required")
    }
    
    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || " ",
        email,
        password,
        username:username.toLowerCase()

    })

    const createUser= await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(createUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered Successfullyy")
    )


})

export {
    registerUser,
}