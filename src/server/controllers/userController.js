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

/* const getAllUsers = async (req, res) => {
  const headerAuth = req.header("Authorization");
  const token = headerAuth.replace("Bearer ", "");
  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  const users = await User.find();
  const actualUser = await User.findById(id);
  const returnedUsers = users.filter((user) => user.id !== actualUser.id);
  res.status(200).json({ returnedUsers });
}; */

const getUser = async (req, res) => {
  const headerAuth = req.header("Authorization");
  const token = headerAuth.replace("Bearer ", "");
  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  const actualUser = await User.findById(id);
  res.status(200).json({ actualUser });
};

module.exports = { registerUser, loginUser, getUser };

/* const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../../database/models/User");
const encryptPassword = require("../utils/encryptPassword");

const registerUser = async (req, res, next) => {
  const user = req.body;
  const { username, password } = user;

  const existingUser = await User.findOne({ username });

  if (!existingUser) {
    const encryptedPassword = await encryptPassword(password);
    user.password = encryptedPassword;
    const createdUser = await User.create(user);
    res.json(createdUser);
  } else {
    const error = new Error("Sorry, username already taken");
    error.code = 409;
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    const error = new Error("Username or password are wrong");
    error.code = 403;
    next(error);
  } else {
    const userData = {
      name: user.name,
      username: user.username,
      id: user.id,
    };
    const rightPassword = await bcrypt.compare(password, user.password);
    if (!rightPassword) {
      const error = new Error("Username or password are wrong");
      error.code = 403;
      next(error);
    } else {
      const token = jsonwebtoken.sign(userData, process.env.JWT_SECRET);
      res.json({ token });
    }
  }
};

module.exports = { registerUser, loginUser };
 */
