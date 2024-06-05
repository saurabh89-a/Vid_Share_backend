import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";

export const register= catchAsyncError(async(req,res,next)=>{
    const{first_name, last_name,username, email,phone,password,confirm_password}=req.body;
    if(!first_name|| !last_name||!username|| !email|| !phone|| !password|| !confirm_password){
        return next(new ErrorHandler("Please fill full registration form! "));
    }

    const isEmail=await User.findOne({email});
    if(isEmail){
        return next(new ErrorHandler("Email already exists!"));
    }
    const user= await User.create({
        first_name, 
        last_name,
        username, 
        email,
        phone,
        password,
        confirm_password,
    });
    res.status(200).json({
        success:true,
        message: "User registered!",
        user,
    });
});

/*
export const login=catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email||!password){
     return next(new ErrorHandler("Please provide email,password.",400));
    }
   const user= await User.findOne({email}).select("+password") ;
   if(!user){
     return next(new ErrorHandler("Invalid Email or Password",400));
   }

   console.log(user.password,password)
   const isPasswordMatched=await user.comparePassword(password);
  console.log(isPasswordMatched);
   if(!isPasswordMatched){
     return next(new ErrorHandler("Invalid Email or Password",400));
   }
   sendToken(user,200,res,"User logged in successfully");
});
*/

export const login = catchAsyncError(async (req, res, next) => {
    const { loginIdentifier, password } = req.body;

    if (!loginIdentifier || !password) {
        return next(new ErrorHandler("Please provide username/email and password.", 400));
    }

    // Find user by email or username
    const user = await User.findOne({
        $or: [{ email: loginIdentifier }, { username: loginIdentifier }]
    }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Username/Email or Password", 400));
    }

    // Check if password matches
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Username/Email or Password", 400));
    }

    // If everything is correct, send the token
    sendToken(user, 200, res, "User logged in successfully");
});

