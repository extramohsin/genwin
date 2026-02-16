const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    branch: { 
      type: String, 
      required: true,
      trim: true 
    },
    year: { 
      type: String, 
      required: true,
      trim: true 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
