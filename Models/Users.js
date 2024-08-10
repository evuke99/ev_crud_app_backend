const mongoose = require("mongoose");

//Creates a new Schema for the database
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
      required: true,
    },
    Username: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("Users", UserSchema);
module.exports = UserModel;
