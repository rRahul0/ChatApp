import mongoose from 'mongoose';
import { mailSender } from '../utils/mailSender.js';
import {otpTemplate} from '../mailTemplets/otpTemplet.js'


const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
		type: Date,
		default: Date.now,
		expires: 120, 
	},
})

async function sendVerificationEmail(email, otp) {
    try {
        await mailSender(email, "Verification Email", otpTemplate(otp))
    } catch (error) {
        console.log("error occured at sending email", error)
        throw error
    }
}


otpSchema.pre("save", async function (next) {
    console.log("New document saved to database");
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
})

export default mongoose.model("OTP", otpSchema)