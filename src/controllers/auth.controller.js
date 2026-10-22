const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "please provide the missing fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

//check User login
const userLogin = async (req, res) => {
  const{email, password} = req.body;
  try{

    if(!email || !password) {
      return res.status(400).json({
        success : false,
        message : "Please provide the missing fields"
      });
    }

const user = await User.findOne({ email }).select("+password");
    if(!user) {
      return res.status(404).json({
        success : false,
        message : "User with that email does not exist"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if(!isPasswordValid) {
      return res.status(401).json({
        success : false,
        message : "Invalid password"
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" }); 
    const refreshToken = jwt.sign({id : user._id}, process.env.JWT_REFRESH_SECRET, {expiresIn : "7d"}); 
        
    res.cookie("token", token, {
      httpOnly: true,
      secure : process.env.NODE_ENV === "production",
      sameSite : "strict",
      maxAge : 15 * 60 * 1000
    }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure : process.env.NODE_ENV === "production",
      sameSite : "strict",
      maxAge : 7 * 24 * 60 * 60 * 1000
    }
    );

    return res.status(200).json({
      success : true,
      message : "User logged in successfully",
    });
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// const getCurrentUser = async (req, res) => {
//   try{
//     const user = req.user;
//     if(!user){
//       return res.status(404).json({
//         success : false,
//         message : "User not found"
//       });
//     }
//       return res.status(200).json({
//         success : true,
//         message : "Current user retrieved successfully",
//         user
//       });
//   }
//   catch(error){
//       res.status(500).json({
//         success: false,
//         message: error.message || "User with that email does not exist",
//       });
//   }
// }

//logout user
const logoutUser = (req, res) => {
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;
    if(!token && !refreshToken) {
        return res.status(400).json({
            success : false,
            message : "User is not logged in"
        });
    }

    res.clearCookie("refreshToken");
     res.clearCookie("token");
     return res.status(200).json({
        success : true,
        message : "User logged out successfully"
     });
}


const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

const adminTest = (req, res) => {
  res.json({
    success : true,
    message : "welcome to admin panel"
  });
}


exports.registerUser = registerUser;
exports.userLogin = userLogin;
// exports.getCurrentUser = getCurrentUser;
exports.logoutUser = logoutUser;
exports.adminTest = adminTest;
exports.refreshToken = refreshAccessToken;