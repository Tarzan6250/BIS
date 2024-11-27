// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  team_id: { type: String, required: true },
  password: { type: String, required: true },
  score: { type: Number, default: 0 }, // Add score field
});

const User = mongoose.model("User", userSchema);

module.exports = User;
