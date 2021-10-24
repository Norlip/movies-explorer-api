const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const SomethingWrong = require('../errors/something-wrong');
const NotFoundError = require('../errors/not-found');
const EmailError = require('../errors/email-error');
const NonAuth = require('../errors/not-auth');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => res.status(200).send({
      data: {
        name: user.name,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        next(new EmailError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

const reloadProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    email: req.body.email,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не надйен');
      } res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new SomethingWrong('Введены некорректные данные');
      }
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new EmailError('Пользователь с таким email уже существует');
      } else { next(err); }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => next(new NonAuth('Введены некорректные данные')));
};

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  createUser, reloadProfile, login, getMe,
};
