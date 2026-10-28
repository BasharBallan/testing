const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // ===========================
    // BASIC USER INFO
    // ===========================
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: [true, "your email is already used"],
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    profileImg: String,

    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
      minlength: [6, "Too short password"],
    },

    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    passwordResetAttempts: {
      type: Number,
      default: 0,
    },
    lastPasswordResetRequest: Date,

    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      default: "user",
    },

    active: {
      type: Boolean,
      default: true,
    },

    googleId: {
      type: String,
      default: null,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    passwordManuallySet: {
      type: Boolean,
      default: false,
    },



    // ===========================
    // OPTIONAL AUDIT & SECURITY
    // ===========================
    auditLog: [
      {
        action: String,
        timestamp: Date,
        ip: String,
        device: String,
      },
    ],

    signupDeviceInfo: String,
    signupIpAddress: String,

    },

  { timestamps: true }
);

// ===========================
// PASSWORD HASHING
// ===========================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
