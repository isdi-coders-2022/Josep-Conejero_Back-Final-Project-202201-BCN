require("dotenv").config();
const express = require("express");
const {
  getAllQuestions,
  addQuestion,
  deleteQuestion,
  updateQuestion,
} = require("../controllers/questionController");

const router = express.Router();

router.get("/", getAllQuestions);
router.post("/", addQuestion);
router.delete("/:idQuestion", deleteQuestion);
router.put("/:idQuestion", updateQuestion);

module.exports = router;
