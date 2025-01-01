import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
//for login purpose we making a method of tokens here 
const generateAccessAndRefreshToken = async (userId) => {
  try {
    // Retrieve the user by ID
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Generate the access token using the user's generateAccessToken method
    const accessToken = await user.generateAccessToken();

    // Generate the refresh token using the user's generateRefreshToken method
    const refreshToken = await user.generateRefreshToken();

    // Optionally, you may choose to save the refresh token in the database
    // if required (e.g., if you want to store it for future invalidation)
    // await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    // Proper error handling
    console.error("Error generating tokens:", error.message);
    throw new ApiError(
      500,
      "Something went wrong while generating Access and Refresh Tokens"
    );
  }
};


//start
const registerUser = asyncHandler(async (req, res) => {
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

  // req.body refers to the body of an HTTP request in a web application,
  // typically containing the data sent by the client to the server.

  const { userName, fullName, email, password } = req.body;

  console.log("req body", req.body);


  //we are using throw instead of return as we have centralized
  // Use throw when you want a centralized, scalable, and maintainable approach to error handling.
  // Use return for small, simple projects where centralized error handling isn't needed.

  //for validation
  if (fullName === "") {
    throw new ApiError(400, "fullname is required");
  }
  // else if(fullName ===""){
  //   return res.status(400).json({message:"fullname is required"})
  // }
  else if (userName === "") {
    throw new ApiError(400, "username is required");
  } else if (email === "") {
    throw new ApiError(400, "email is required");
  } else if (password === "") {
    throw new ApiError(400, "password is required");
  }
  // we check for @ nos in email also
  // if([fullName, email,userName,password].some((field)=>
  //   field?.trim()===""))
  //    {
  //      throw new ApiError(400,"all field are compulsory")
  //    }

  console.log("username", userName);

  //now checking whether usernme already exist
  //so here we importing User from user,model.js as it is
  //  connected to mongoDB database so wewill find it apply the condition

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "username already exist");
    // res.status(400).json(message,'username exist')
  }
  //now handling images and avatar
  //using cloudinary
  // req.files?.avatar[0]?.path

  // Handle avatar and cover image uploads
  // req.files is typically an object, where each key represents the field
  // name (as specified in the form)
  //  and the value is an array of file objects.
  console.log("req.files:", req.files);

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    console.error("Avatar file missing. req.files:", req.files);
    throw new ApiError(400, "Avatar file is required");
  }
  // avatar?.[0]?.path:
  // ?->  called optional chaining
  // avatar is expected to be an array of file objects (e.g., [file1, file2, ...]).
  // [0] accesses the first file object in the array.
  // ?.path retrieves the path property of that file object (the local path where the file is temporarily stored).
  // const avatarLocalPath = req.files?.avatar?.[0]?.path;:

  // If req.files exists and contains a field avatar, and if avatar is an array with at least one file, this retrieves the local path of the first uploaded avatar file.
  // If any of these conditions are not met, avatarLocalPath is assigned undefined.
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;:

  // Similarly, this retrieves the local path for the first uploaded coverImage file if it exists. If not, coverImageLocalPath is undefined.
  //Upload images to Cloudinary
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const avatar = await uploadOnCloudinary(avatarLocalPath).catch((err) => {
    console.error("Cloudinary upload error:", err);
    throw new ApiError(500, "Failed to upload avatar");
  });

  console.log("avatar url ", avatar.url?.url);
  console.log("Cover Image URL:", coverImage?.url);
  // Ensure cover image URL is correctly logged

  //now creating object and make entryin database using User

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    //corner case :if user providied cverimage then great otherwise no eror will be there ,no problem
    password,
    email,
    userName: userName.toLowerCase(),
  });

  //another to check whether user created or not or field is empty
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registration of user");
  }

  // now return response from server
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});


//login algorithm

const loginUser = asyncHandler(async (req, res) => {
  //user entering username emailpassword  req.body ->data
  //verify if any field is empty
  //find the user
  // checking passsword check if the data is matching to database

  //generate access and refresh token and send to user
  //send cookies

  // verification either using email or username
  const { email, userName, password } = req.body;
console.log("req body",req.body)

  if (!email && !userName) {
    throw new ApiError(400, "username or email is required");
  }
  // else if(!password){
  //   throw new ApiError(400,"password is compulsory")
  // } since password is encrypted in database so we have to use bcrypt to validate
  // password nt directly usign ifelse
  // else if (userName === "" || email === "") {
  //   throw new ApiError(400, "username or email should not be empty");
  // }
  //finding and validating either username or email in database
  const verifiedUser = await User.findOne({
    $or: [{userName}, {email}]
})

console.log(verifiedUser)

if (!verifiedUser) {
    throw new ApiError(404, "User not found")
}

  //password verification
  const isPasswordValid = await verifiedUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw  new ApiError(401, "password incorrect");
  }

const  {accessToken,refreshToken} = await generateAccessAndRefreshToken(verifiedUser._id)

//optional method 
//.select("-password -refreshToken") it means we dont user to have password and refrreshtoken
const loggedInUSer= await User.findById(verifiedUser._id).select("-password -refreshToken")



//now sending the tokens to cookies

const options={
  httpOnly:true,
  secure:true
}

return res.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
  new ApiResponse(200,{
    user:loggedInUSer,accessToken,refreshToken
  }, "user logged in successfully")
)

});
//logout algorithm

const logoutUser= asyncHandler( async(req , res)=>{

  User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },
    {
      new:true
    }
  )

  const options={
    httpOnly:true,
    secure:true
  }
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,"user logged out successfully " ))

  
})



const refreshAccessToken= asyncHandler(async(req,res)=>{


const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken

if(!incomingRefreshToken){
  throw new ApiError(401,"unauthorised request")
}
// now verifying incoming token request we need encrypted password from database

const decodedToken = jwt.verify(
  incomingRefreshToken,process.env.REFRESH_TOKEN
)


const user = await User.findById(decodedToken?._id)
if(!user){
  throw new ApiError(401,"Invalid Refresh token")
}

if(incomingRefreshToken !== user?.refreshToken){
  throw new ApiError(401, " refresh token expired")

}
// before generaitng token send in cookies
const options= {
  httpOnly:true,
  secure:true 
}

const {accessToken,newrefreshToken}=await generateAccessAndRefreshToken(user._id)
return res
.status(200)
.cookie("accesstoken".accessToken,options)
.cookie("refreshtoken",newrefreshToken ,options)
.json(
  new ApiResponse(
    200,
    {accessToken,refreshToken:newrefreshToken},"refresh token refreshed "

    
  )
)




})








export { registerUser, loginUser ,logoutUser,refreshAccessToken};
