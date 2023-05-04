const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    versionKey: false,
  }
);

const Usermodel = mongoose.model("user", userSchema);

module.exports = {
  Usermodel,
};
