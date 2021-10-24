const express = require('express');
const { errors } = require('celebrate');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const router = require('./routes/index');
const limiter = require('./middlewares/rateLimiter');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const whitelist = [
  'http://front.norlip.nomoredomains.club',
  'https://front.norlip.nomoredomains.club',
  'http://localhost:8000',
  'http://localhost:3000',

];

const app = express();
app.use(helmet());

app.use(cors({
  origin: whitelist,
  credentials: true,
}));
const {
  NODE_ENV, DB_URL,

  PORT = 3000,
} = process.env;

mongoose.connect(NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,

});
app.use(requestLogger);
app.use(cookieParser());

app.use(bodyParser.json());
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(limiter);

app.use('/', router);

app.use(errorLogger);
app.use(errors());

app.use((err, req, res) => {
  const { status = 500, message } = err;

  res
    .status(status)
    .send({
      message: status === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {

});
