require("dotenv").config();
const express = require("express");
const {
  registerUser,
  loginUser,
  getUser,
  getUsers,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", auth, getUser);
router.get("/", getUsers);

module.exports = router;
