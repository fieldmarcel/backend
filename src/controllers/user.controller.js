import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser= asyncHandler(async(req,res) =>{
  //  res.status(200).json({
  
  // //for user register
    //stp-1 get user details from frontend
//stp-2 validation  ie whether user ddint fill any of the field --empty
//stp-3check if user already exists:by username and email
//stp-4check images , checking of avatar if available then
//upload on cloudinary,avatar

//stp-5-create user object(req for mongDB)- create entry in db
//stp-6 remove password and refresh token field from response
//check for user creation
//return res


// so now we have to gety user details from frontend by following method



const {userName, fullName, email,password}=req.body
console.log("req body",req.body);
//we are using throw instead of return as we have centralized 
// Use throw when you want a centralized, scalable, and maintainable approach to error handling.
// Use return for small, simple projects where centralized error handling isn't needed.

//for validation 
// if(fullName===""){
// throw new ApiError(400,"fullname is required")
// }
// // else if(fullName ===""){
// //   return res.status(400).json({message:"fullname is required"})
// // }
// else if(userName===""){
//   throw new ApiError(400,"username is required")
//   }
//   else if(email===""){
//     throw new ApiError(400,"email is required")
//     }
//     else if (password===""){
//       throw new ApiError(400,"password is required")
//       }
// we check for @ nos in email also
if([fullName, email,userName,password].some((field)=>
  field?.trim()===""))
   {
     throw new ApiError(400,"all field are compulsory")
   }
   
console.log("username",userName)

//now checking whether usernme already exist 
//so here we importing User from user,model.js as it is
//  connected to mongoDB database so wewill find it apply the condition 

const existedUser =  User.findOne({

  $or:[{userName},{email}]

})
if(existedUser){
   throw new ApiError(409,"username already exist")
  // res.status(400).json(message,'username exist')
}
//now handling images and avatar
//using cloudinary
// req.files?.avatar[0]?.path


const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;

if(!avatarLocalPath){
  throw new ApiError(400,"avatar file is required");
}
const avatar =await uploadOnCloudinary(avatarLocalPath)
const coverImage= await uploadOnCloudinary(coverImageLocalPath);
if(!avatar){
  throw new ApiError(400,"Avatar is compulsory")
}

//now creating object and make entryin database using User

const user = await User.create({
fullName,
avatar:avatar.url,
coverImage:coverImage?.url || "" ,
 //corner case :if user providied cverimage then great otherwise no eror will be there ,no problem
password,
email,
userName:userName.toLowerCase()

})

//another to check whether user created or not or field is empty 
User.findById(user._id).select("-password -refreshToken")

if(!createdUSer){
  throw new ApiError(500,"something went wrong while registration of user")
}

// now return response from server
return res.status(201).json(


new ApiResponse(200, createdUSer,"User registered successfully")

)
})


export { registerUser };

// another method  //in place of it map can also  be used
