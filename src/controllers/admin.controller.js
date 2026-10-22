const User = require("../models/user.model");
const mongoose = require("mongoose");

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getUsers = async (req, res) => {
  try {
    const { search, role, page, limit } = req.query;
    const pageNumber = Number(page ?? 1);
    const limitNumber = Number(limit ?? 10);

    if (search && typeof search !== "string") {
      return res.status(400).json({
        success: false,
        message: "search must be a string",
      });
    }
    if (role !== undefined && typeof role !== "string") {
      return res.status(400).json({
        success: false,
        message: "Role must be a string",
      });
    }

    if (role !== undefined && !["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either user or admin",
      });
    }

    const filter = {};

    if (role && ["user", "admin"].includes(role)) {
      filter.role = role;
    }

    const trimmedSearch = typeof search === "string" ? search.trim() : "";

    if (trimmedSearch !== "") {
      const escapedSearch = escapeRegex(trimmedSearch);
      filter.$or = [
        {
          name: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          email: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    if (limitNumber > 100) {
      return res.status(400).json({
        success: false,
        message: "limit must be less than or equal to 100",
      });
    }

    if (
      Number.isInteger(pageNumber) === false ||
      Number.isInteger(limitNumber) === false
    ) {
      return res.status(400).json({
        success: false,
        message: "page and limit must be integers",
      });
    }

    if (pageNumber <= 0 || limitNumber <= 0) {
      return res.status(400).json({
        success: false,
        message: "page and limit must be positive integers",
      });
    }
    const skip = (pageNumber - 1) * limitNumber;

    const users = await User.find(filter)
      .select("name email role")
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limitNumber);

    if (totalUsers > 0 && pageNumber > totalPages) {
      return res.status(400).json({
        success: false,
        message: "page number is out of range",
      });
    }

    const hasPreviousPage = pageNumber > 1;
    const hasNextPage = pageNumber < totalPages;

    res.status(200).json({
      success: true,
      message: "users retrieved successfully",
      users: users,
      totalUsers: totalUsers,
      totalPages,
      pageNumber,
      hasPreviousPage,
      hasNextPage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "user id is required",
      });
    }

    if (mongoose.isObjectIdOrHexString(userId) === false) {
      return res.status(400).json({
        success: false,
        message: "invalid user id",
      });
    }

    const user = await User.findById(userId)
      .select("_id name email role")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "user retrieved successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.isObjectIdOrHexString(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const { name, email, role } = req.body;

    if (name === undefined && email === undefined && role === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, or role to update",
      });
    }

    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name must be a non-empty string",
        });
      }

      updates.name = name.trim();
    }

    if (email !== undefined) {
      if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address",
        });
      }

      updates.email = email.trim().toLowerCase();
    }

    if (role !== undefined) {
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Role must be either user or admin",
        });
      }

      updates.role = role;
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (updates.email !== undefined) {
      const existingUser = await User.findOne({
        email: updates.email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered",
        });
      }
    }

    Object.assign(user, updates);
    await user.save();

    const updatedUser = await User.findById(userId).select("-password").lean();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }

    console.error("Update user error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "user id is required",
      });
    }
    if (!mongoose.isObjectIdOrHexString(userId)) {
      return res.status(400).json({
        success: false,
        message: "invalid user id",
      });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user deleted successfully",
      userId: deletedUser._id,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.updateUserById = updateUserById;
exports.deleteUserById = deleteUserById;
