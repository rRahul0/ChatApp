import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const auth = async (req, res, next) => {
    try {
        const token = req.body.token || req.cookies.token || req.header('Authorization').replace("Bearer ", "");
        if (!token)
            return res.status(400).json({ sucess: false, message: "token not found" })

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode
        } catch (error) {
            return res.status(401).json({ sucess: false, message: error.message, })
        }
        next()

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            sucess: false,
            message: "something went wrong while validating token",
        })
    }
}