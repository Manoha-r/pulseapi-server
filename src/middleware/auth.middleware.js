const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async(req, res, next) => {    
    try{
         const autharization  = req.cookies.token;

         if(!autharization){
            return res.status(401).json({
                success : false,
                message : "autherization token required"
            });
         }

        const token = autharization;
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decode.id).select("-password");
        if(!user){
            return res.status(401).json({
                success : false,
                message : "user no longer exists"
            });
        }
        req.user = user;
        next();
    }
    catch(error){
        return res.status(401).json({
            success : false,
            message : "Unauthorized access"
        });
    }
}

module.exports = authMiddleware;