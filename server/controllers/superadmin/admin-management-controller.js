const bcrypt = require("bcryptjs");
const User = require("../../models/User");

// Get all admins (excluding superadmins)
const getAllAdmins = async (req, res) => {
  try {
    // Only show regular admins, not superadmins
    const admins = await User.find({ 
      role: "admin" 
    }).select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching admins",
    });
  }
};

// Get all users with role statistics
const getUserStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalSuperAdmins = await User.countDocuments({ role: "superadmin" });
    const totalAll = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalSuperAdmins,
        totalAll,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
    });
  }
};

// Create a new admin
const createAdmin = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Validate input
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 12);

    // Create new admin
    const newAdmin = new User({
      userName,
      email,
      password: hashPassword,
      role: "admin",
      authProvider: 'local',
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        id: newAdmin._id,
        userName: newAdmin.userName,
        email: newAdmin.email,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating admin",
    });
  }
};

// Update admin details
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, email, password } = req.body;

    // Find admin
    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Prevent modifying superadmins
    if (admin.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Cannot modify superadmin accounts",
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== admin.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
      admin.email = email;
    }

    // Update fields
    if (userName) admin.userName = userName;
    if (password) {
      admin.password = await bcrypt.hash(password, 12);
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: {
        id: admin._id,
        userName: admin.userName,
        email: admin.email,
        role: admin.role,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating admin",
    });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Prevent deleting superadmins
    if (admin.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete superadmin accounts",
      });
    }

    // Prevent deleting regular admins, only remove admin role
    if (admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Can only manage admin accounts",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error deleting admin",
    });
  }
};

// Toggle admin status (activate/deactivate)
const toggleAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (admin.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Cannot modify superadmin status",
      });
    }

    admin.isActive = isActive;
    await admin.save();

    res.status(200).json({
      success: true,
      message: `Admin ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: admin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating admin status",
    });
  }
};

module.exports = {
  getAllAdmins,
  getUserStatistics,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  toggleAdminStatus,
};

