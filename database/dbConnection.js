import mongoose from "mongoose";

export const dbConnection=() =>{
    mongoose
    .connect(process.env.MONGO_URI,{
        dbName: 'Video_Sharing_Application',
    })
    . then(()=>{
        console.log('Connected to database!');
    })
    .catch((err)=>{
        console.log(`Some error occuered while connecting to database : ${err}`);
    })
}