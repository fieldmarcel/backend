import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true, // to make it easier in database searching
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  avatar: {
    type: String,
    required: true, // using cloudinary URL
  },
  coverImage: {
    type: String,
  },
  watchHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  password: {
    type: String, // not no.
    required: [true, "Password is required"],
  },
  refreshToken: {
    type: String,
  },
  accessToken: {
    type: String,
  },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error); // Pass the error to Mongoose for further handling
    }
});

userSchema.methods.isPasswordCorrect = async function(password){

    console.log(this.password)
    console.log(password)
    console.log('here si the password ',await bcrypt.compare(password , this.password) )
    return await bcrypt.compare(password , this.password)

} 

// Method to generate access token
userSchema.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.userName,
      fullName: this.fullName,
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // You might want to use a different expiry for refresh token
    }
  );
};

export const User = mongoose.model("User", userSchema);
