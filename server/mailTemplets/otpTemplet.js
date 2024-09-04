// otpTemplate.js
export function otpTemplate(otp) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                background-color: #ffffff;
                margin: 50px auto;
                padding: 20px;
                max-width: 600px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333333;
            }
            p {
                font-size: 16px;
                color: #666666;
                line-height: 1.5;
            }
            .otp {
                font-size: 24px;
                font-weight: bold;
                color: #000000;
                margin: 20px 0;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #999999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>NeoChat Email Verification</h1>
            <p>Dear User,</p>
            <p>Thank you for registering with NeoChat! To complete your registration, please use the following OTP (One Time Password) to verify your email address:</p>
            <div class="otp">${otp}</div>
            <p>This OTP is valid for the next 2 minutes. Please do not share this OTP with anyone.</p>
            <p>If you did not request this verification, please ignore this email.</p>
            <div class="footer">
                <p>Best regards,</p>
                <p>The NeoChat Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
