//Author:Harikrishnan Kuppusamykrishnan
//Project: Whats App Clone backend
//Date: 08/06/2020
//Description: This file holds the data structure for all our messages


import mongoose from 'mongoose';

//define data schema

 const whatshariSchema = mongoose.Schema({
    message:String,
    name:String,
    timeStamp:String,
    received:Boolean
})

 export const Messages = mongoose.model('messagecontent',whatshariSchema)