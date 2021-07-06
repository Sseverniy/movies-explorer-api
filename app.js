const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
require('dotenv').config();
// const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const mainRouter = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const { PORT = 3005 } = process.env;

app.use(cors({
  origin: true,
  exposedHeaders: '*',
  credentials: true,
}));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

app.use(express.json());
// app.use(helmet);
app.use(requestLogger);
app.use(limiter);

app.use('/', mainRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
