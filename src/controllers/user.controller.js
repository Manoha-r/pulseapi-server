const bcrypt = require("bcryptjs");
const User = require("../models/user.model");


const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Current user retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "User with that email does not exist",
    });
  }
};

const updateCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, avatar } = req.body;

    if (!name && !avatar) {
      return res.status(400).json({
        success: false,
        message: "Please provide name or avatar to update",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        ...(name && { name }),
        ...(avatar && { avatar }),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1. Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current password and new password",
      });
    }

    // 2. Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    // 3. Find authenticated user
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 4. Check current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // 5. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 6. Update password
    user.password = hashedPassword;
    await user.save();

    // 7. Response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


const deleteCurrentUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.getCurrentUser = getCurrentUser;
exports.updateCurrentUser = updateCurrentUser;
exports.changePassword = changePassword;
exports.deleteCurrentUser = deleteCurrentUser;
