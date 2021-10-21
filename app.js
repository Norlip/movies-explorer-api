const express = require('express');
const { errors } = require('celebrate');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { login, createUser } = require('./controllers/users');

const {
  userValid,
  loginValid,
} = require('./middlewares/valid');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const whitelist = [
  'http://front.norlip.nomoredomains.club',
  'https://front.norlip.nomoredomains.club',
  'http://localhost:8000',
  'http://localhost:3000',

];

app.use(cors({
  origin: whitelist,
  credentials: true,
}));
const { PORT = 3000 } = process.env;
const NotFoundError = require('./errors/not-found');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
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
app.post('/signin', loginValid, login);
app.post('/signup', userValid, createUser);
app.use(auth);
app.use('/', usersRouter);
app.use('/', moviesRouter);
app.use(errorLogger);
app.use(errors());

app.use('*', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
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
