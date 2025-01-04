// this middleware will verify whether user is there
//  or not in database ...to be used in logout
//  we are creating our middleware for the abve purpose
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";






// _ instead of res is written production grade code
export const verifyJWT= asyncHandler(async(req , _ , next)=>{
try {

   const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
    
    if(!token)
    {
        throw new ApiError(401,"Unauthorized request")
    }

    const decodedToken = await jwt.verify( token , process.env.ACCESS_TOKEN)

    console.log(decodedToken);
    
    const user =await User.findById(decodedToken?._id).select ("-refreshToken -password")
    
    if(!user){
        throw new ApiError(401,"invalid Access Token")
    }
    
    req.user = user;
    next();
    
} catch (error) {
    
throw new ApiError(401,"invalid  access token ")


}


})