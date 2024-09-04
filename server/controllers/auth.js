import User from "../models/User.js";
import OTP from "../models/otp.js";
import { mailSender } from "../utils/mailSender.js";
import { passwordResetTemplate } from "../mailTemplets/passwordresetTemplet.js";

import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import otpGenerator from "otp-generator";
dotenv.config();

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const checkuserpresent = await User.findOne({ email });
    if (checkuserpresent) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    // if no generate otp
    let otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // uniqueness
    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp });
    }

    //create DB entry
    const otpBody = await OTP.create({ email: email, otp: otp });

    //send response
    return res.status(200).json({
      success: true,
      message: "OTP sent sucessfully",
      otp: otpBody.otp,
    });
  } catch (error) {
    console.log(error.message);
  }
}
export const signUp = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, otp } = req.body;
    if (!email || !password || !firstName || !lastName || !otp)
      return res.status(400).send("Please fill all the fields");

    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) return res.status(400).json({
      success: false,
      message: "User already exist",
    });

    //find most recent otp
    const recentOTP = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(-1);

    //validate otp
    if (otp !== recentOTP[0].otp) {
      return res.status(400).json({
        success: false,
        message: "OTP doesn't matched",
        // recentOTP,
        // otp,
      });
    } else if (recentOTP.length == 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    //hashpassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      image: {
        url: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        public_id: null
      },
      email: email,
      password: hashedPassword,
    });
    return res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const isExistUser = await User.findOne({ email })

    if (!isExistUser) {
      return res.status(400).json({
        success: false,
        message: "user doesn't exist",
      });
    }

    //password matching
    if (await bcrypt.compare(password, isExistUser.password)) {
      const payload = {
        id: isExistUser._id,
        email: isExistUser.email,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      isExistUser.token = token;
      isExistUser.password = undefined;

      const options = {
        expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user: isExistUser,
        message: "Loggedin sucessfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "password not matched",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failure, please try again",
      hint: error.message,
    });
  }
};

export const resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      });
    }
    const token = crypto.randomBytes(20).toString("hex");

    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    const url = `${process.env.FRONTEND_URL}/update-password/${token}`;

    await mailSender(
      email,
      "Password Reset",
      passwordResetTemplate(url)
    );
    return res.status(200).json({
      success: true,
      message:
        "Email Sent Successfully, Please Check Your Email to Continue Further",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: `Some Error in Sending the Reset Message`,
    });
  }
};

export const resetPassword = async (req, res) => {

  try {
      const { password, confirmPassword, token } = req.body;
      if (confirmPassword !== password) {
          return res.json({
              success: false,
              message: "Password and Confirm Password Does not Match",
          });
      }
      const userDetails = await User.findOne({ token: token });
      if (!userDetails) {
          return res.json({
              success: false,
              message: "Token is Invalid",
          });
      }
      if (!(userDetails.resetPasswordExpires > Date.now())) {
          return res.status(403).json({
              success: false,
              message: `Token is Expired, Please Regenerate Your Token`,
          });
      }
      const encryptedPassword = await bcrypt.hash(password, 10);
      
      await User.findOneAndUpdate(
          { token: token },
          { password: encryptedPassword },
          { new: true }
      );
      res.status(200).json({
          success: true,
          message: `Password Reset Successful`,
      });
  }
  catch (error) {
      return res.status(500).json({
          error: error.message,
          success: false,
          message: `Some Error in Updating`,
      })
  }
}