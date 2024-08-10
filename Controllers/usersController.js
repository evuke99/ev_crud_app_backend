const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserModel = require("../Models/Users");
const mongoose = require("mongoose");

// Creates a single user in the database
const createUser = async (req, res) => {
  const salt = 10;

  const {
    FirstName,
    LastName,
    Username,
    Password: plainTextPassword,
  } = req.body;
  const Password = await bcrypt.hash(plainTextPassword, salt);
  try {
    const user = await UserModel.create({
      FirstName: FirstName,
      LastName: LastName,
      Username: Username,
      Password: Password,
    });
    res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ err: err.message });
  }
};

// Lists out all of the users
const getUsers = async (req, res) => {
  const users = await UserModel.find({}).sort({ createdAt: -1 });

  res.status(200).json(users);
};

// Gets a single user by its ID
const getUserByID = (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No user found, invalid ID" });
  }
  UserModel.findById(id).then((err, result) => {
    if (!id) {
      return res.status(400).json({ error: "No user found" });
    }
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
};

// Deletes a single user by its ID
const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No user found,  ID" });
  }
  const user = await UserModel.findOneAndDelete({ _id: id });
  if (!id) {
    return res.status(400).json({ error: "No user found" });
  }
  res.status(200).json(user);
};

// Updates a single user by its ID
const updateUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID format" });
  }
  const user = await UserModel.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );
  if (!id) {
    return res.status(400).json({ error: "No user found" });
  }
  res.status(200).json(user);
};

const loginUser = async (req, res) => {
  const { Username, Password } = req.body;

  const user = await UserModel.findOne({ Username });
  if (!user) {
    return res.json({ message: "Username or Password Incorrect" });
  }

  const isValid = await bcrypt.compare(Password, user.Password);
  if (!isValid) {
    console.log("Username or Password Incorrect");
    return res.json({ message: "Username or Password Incorrect" });
  }

  const token = jwt.sign(
    { Username: user.Username, _id: user._id },
    process.env.KEY,
    {
      expiresIn: "1h",
    }
  );
  res.cookie("token", token, { maxAge: 360000 });
  return res.json({ status: true, message: "login successfully" });
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  return res.json({ status: true });
};

const authorization = (req, res, next) => {
  const token = req.cookies.token;
  // console.log(token);
  if (!token) {
    return res.json("No user signed on");
  }
  try {
    // console.log("here hello");
    const data = jwt.verify(token, process.env.KEY);
    req.Username = data.Username;
    req._id = data._id;
    return next();
  } catch {
    return res.status(403).json("Token not verified");
  }
  // res.cookie("loggedin", "true");
  // next();
};

const getCurrentUser = (req, res) => {
  const json = {
    user: {
      Username: req.Username,
      _id: req._id,
    },
  };
  // console.log(req.Username);
  return res.send(json);
};

module.exports = {
  createUser,
  getUsers,
  getUserByID,
  deleteUser,
  updateUser,
  loginUser,
  logoutUser,
  authorization,
  getCurrentUser,
};
