require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const tuitsRouter = require("./routers/questionsRouter");

const { notFoundError, generalError } = require("./middlewares/errors");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());

app.use("/questions", questionsRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
