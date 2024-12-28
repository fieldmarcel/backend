import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser= asyncHandler(async(req,res) =>{
  //for user register
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



  
  const {userName, fullName, email,pasword}=req.body

})
export { registerUser };

