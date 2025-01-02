import mongoose from "mongoose";

const subscriptionSchema= new Schema({
subscriber:{
    type: Schema.Types.ObjectId, //person subscribing
    ref:"User"
},
channel:{
    type:Schema.Types.ObjectId,//channel person to whom he/she subscribing
    ref:"User"
},





},{timestamps:true})
export const subscription= mongoose.model("subscription",subscriptionSchema)