const { model, Schema } = require("mongoose");

const QuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  questionsLists: { type: [String] },
  username: {
    type: String,
  },

  /* username: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }, */
  /*   lists: {
    type: [Schema.Types.ObjectId],
    ref: "QuestionsList",
  }, */
});

const Question = model("Question", QuestionSchema, "questions");

module.exports = Question;
