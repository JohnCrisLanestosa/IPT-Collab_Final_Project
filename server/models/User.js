const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    // Removed unique constraint - only email should be unique
  },
  email: {
    type: String,
    required: true,
    unique: true, // Only email must be unique
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password is required only if not using Google OAuth
    },
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
  profilePicture: {
    type: String,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  role: {
    type: String,
    default: "user",
  },
  lastLogin: {
    type: Date,
    default: null, // null means user has never logged in
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
}, {
  timestamps: true,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
