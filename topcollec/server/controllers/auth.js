import catchAsync from "../helper/catchAsync.js";
import User from "../models/users.js";
import { generateOTP, sendEmailWithOTP } from "../mailer/email.js";
import Otp from "../models/otp.js";
import bcrypt from "bcrypt";

const register = catchAsync(async (req, res) => {
    const { username, password, email, bio, profileImage } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        if (existingUser.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already taken, try a new one!",
            });
        } else {
            const otp = generateOTP();
            const expirationTime = new Date(Date.now() + 10 * 1000);
            const createdAt = new Date();

            await Otp.create({ email, otp, expirationTime, createdAt });
            await sendEmailWithOTP(email, otp);

            return res.status(200).json({
                success: true,
                message: "OTP sent to your email. Please verify.",
            });
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        password: hashedPassword,
        email,
        bio,
        profileImage,
        isEmailVerified: false,
    });

    const otp = generateOTP();
    const expirationTime = new Date(Date.now() + 10 * 1000);
    const createdAt = new Date();

    await Otp.create({ email, otp, expirationTime, createdAt });
    await sendEmailWithOTP(email, otp);

    res.status(200).json({
        status: true,
        message: "Account registered successfully. Please check your email and verify!",
        user: {
            email: newUser.email,
            username: newUser.username,
        },
    });
});

const verifyEmail = catchAsync(async(req,res)=>{
    const {email , otp} = req.body;
})

const authController = { register };

export default authController;
