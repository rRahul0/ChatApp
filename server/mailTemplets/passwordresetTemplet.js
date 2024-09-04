// passwordResetTemplate.js
export function passwordResetTemplate(url) {
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
            .reset-link {
                display: inline-block;
                margin: 20px 0;
                padding: 10px 20px;
                background-color: #007BFF;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 18px;
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
            <h1>Password Reset Request</h1>
            <p>Dear User,</p>
            <p>We received a request to reset your password for your NeoChat account. You can reset your password by clicking the button below:</p>
            <a href="${url}" class="reset-link">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email. The link will expire in 5 minutes.</p>
            <div class="footer">
                <p>Best regards,</p>
                <p>The NeoChat Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
