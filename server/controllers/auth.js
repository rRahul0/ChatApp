import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const signUp = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName)
      return res.status(400).send("Please fill all the fields");

    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) return res.status(400).json({
      success: false,
      message: "User already exist",
    });

    //cloudinary image upload
    // image = {
    //     url: url,
    //     public_id: public_id
    // }

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