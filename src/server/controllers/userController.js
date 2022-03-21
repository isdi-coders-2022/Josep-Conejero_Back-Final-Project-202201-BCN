require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/* const fs = require("fs");
const path = require("path"); */
const User = require("../../database/models/User");

const registerUser = async (req, res, next) => {
  const { username, password, name } = req.body;
  const SALT = 10; /* +process.env.SALT */
  try {
    const encryptedPassword = await bcrypt.hash(password, SALT);
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      const error = new Error(`Username ${username} already exists`);
      error.code = 400;
      next(error);
      return;
    }
    const newUser = await User.create({
      username,
      password: encryptedPassword,
      name,
    });
    res.status(201);
    res.json({
      message: `User registered with username: ${newUser.username}`,
    });
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    const error = new Error("User not found");
    error.code = 400;
    return next(error);
  }

  const rightPassword = await bcrypt.compare(password, user.password);
  if (!rightPassword) {
    const error = new Error("Wrong password");
    error.code = 400;
    return next(error);
  }

  const userData = {
    name: user.name,
    id: user.id,
  };

  const token = jwt.sign(userData, process.env.JWT_SECRET);
  return res.json({ token });
};

const getUser = async (req, res) => {
  const headerAuth = req.header("Authorization");
  const token = headerAuth.replace("Bearer ", "");
  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  const actualUser = await User.findById(id);
  res.status(200).json({ actualUser });
};

const getUsers = async (req, res) => {
  const users = await User.find();
  res.json({ users });
};

module.exports = { registerUser, loginUser, getUser, getUsers };
