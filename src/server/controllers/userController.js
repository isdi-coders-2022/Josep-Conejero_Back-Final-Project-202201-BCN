const bcrypt = require("bcrypt");
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
      const token = jsonwebtoken.sign(userData, process.env.SECRET);
      res.json({ token });
    }
  }
};

module.exports = { registerUser, loginUser };
