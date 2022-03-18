const { model, Schema } = require("mongoose");

const QuestionsListSchema = new Schema({
  listName: {
    type: String,
    required: true,
  },
  listSubject: {
    type: String,
    required: true,
  },
  questions: { type: [String] },
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

const QuestionsList = model(
  "QuestionsList",
  QuestionsListSchema,
  "questionslists"
);

module.exports = QuestionsList;
