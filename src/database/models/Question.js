const { model, Schema } = require("mongoose");

const QuestionSchema = new Schema({
  question: {
    type: String,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
    min: 1,
    max: 200,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const Question = model("Question", QuestionSchema, "questions");

module.exports = Question;
