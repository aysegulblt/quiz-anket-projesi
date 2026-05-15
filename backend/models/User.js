const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "İsim zorunludur"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email zorunludur"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Şifre zorunludur"],
      minlength: 8,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);