const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
require('dotenv').config();
// const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const mainRouter = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const { PORT = 3005 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

app.use(express.json());
// app.use(helmet);
app.use(limiter);
app.use(requestLogger);

app.use('/', mainRouter);

app.use(errorLogger);

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  return res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
