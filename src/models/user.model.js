import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema({
userName:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    index:true  // to make it easier in database searching
},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,

},
fullName:{
    type:String,
    required:true,
    trim:true,
    index:true
},

avatar:{
    type:String,
    required:true,
         //using cloudinary url
}, 
coverImage :{
    type:String,

    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,  //not no.
        required:[true,'Password is required'],
        unique:true,
        lowercase:true
    },
    refreshToken:{
        type:String,
    }
     
    

},{timestamps:true})

userSchema.pre("save", async function (next) {//pre middleware runs before a document is saved to the database
    if(this.isModified("password")){

    
    this.password = await bcrypt.hash(this.password,10)}
     next();
    
})

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = async function(){
  return  await jwt.sign(
        {
            id:this.id,
            email:this.email,
            username:this.userName,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN,
        {
         expiresIn:process.env.ACCESS_TOKEN_EXPIRY    
        }
    )
}

userSchema.methods.generateAccessToken = async function(){

    return  await jwt.sign(
        {
            id:this.id,
            email:this.email,
            username:this.userName,
            fullName:this.fullName
        },
        process.env.REFRESH_TOKEN,
        {
         expiresIn:process.env.REFRESH_TOKEN_SECRET    
        }
    )
}
export const  User= mongoose.model("User",userSchema)