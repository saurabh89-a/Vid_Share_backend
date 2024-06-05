import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema= new mongoose.Schema({
    first_name:{
        type:String,
        required: [true,"Please provide your first_name!"],
        minLength: [3, "Name must contain atleast 3 character!"],
        maxLength: [30, "Name cannot exceed 30 character!"],
    },
    last_name:{
        type:String,
        required: [true,"Please provide your last_name!"],
        minLength: [3, "Name must contain atleast 3 character!"],
        maxLength: [30, "Name cannot exceed 30 character!"],
    },
    username: {
        type: String,
        required: [true, "Please provide a username!"],
        unique: true,
        minLength: [3, "Username must contain at least 3 characters!"],
        maxLength: [20, "Username cannot exceed 20 characters!"],
    },
    email:{
        type:String,
        required: [true,"Please provide your email!"],
        validator: [validator.isEmail, "Please provide a valid email!"],
    },
    phone:{
        type:Number,
        required: [true,"Please provide your phone number."]
    },
    password:{
        type:String,
        required:[true, "Please provide your password!"],
        minLength: [3, "Password must contain atleast 8 character!"],
        maxLength: [32, "Password cannot exceed 32 character!"],
        select:false
    },
    confirm_password: {
        type: String,
        required: [true, "Please confirm your password!"],
        select:false,
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: "Passwords do not match!",
        },
    },

    createdAt : {
        type: Date,
        default : Date.now,
    },
});


//HASHING THE PASSWORD

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password= await bcrypt.hash(this.password,10);
});

userSchema.pre("save", async function(next){
    if(!this.isModified("confirm_password")){
        next()
    }
    this.confirm_password= await bcrypt.hash(this.confirm_password,10);
});

//COMPARING PASSWORD

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

//GENERATING A JWT FOR AUTHORIZATION

userSchema.methods.geJWTToken=function(){
    return jwt.sign({id: this._id},process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRE,
    });
};

export const User=mongoose.model("User",userSchema);