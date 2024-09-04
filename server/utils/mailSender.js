import { transporter } from "../config/mailConfig.js"

import { config } from "dotenv"
config()

export const mailSender = async (email, subject, body) => {
    try {

        let info = await transporter.sendMail({
            from: `NeoChat <${process.env.MAIL_USER}>`,
            to: `${email}`,
            subject: `${subject}`,
            html: `${body}`,
        })

    } catch (error) {
        console.log(error.message)
    }
} 