const jwt = require('jsonwebtoken');

const NotAuth = require('../errors/not-auth');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuth('Ошибка авторизации');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new NotAuth('Ошибка авторизации');
  }

  req.user = payload;

  next();
};
