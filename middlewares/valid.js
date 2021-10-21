/* eslint-disable no-useless-escape */
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const url = (val) => {
  if (!validator.isURL(val)) {
    throw new Error('Неправильный адресс');
  }
  return (val);
};

const updateValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .message('Минимальная длина именим - 2, максимальная - 30'),
    email: Joi.string().required().email().message('Не верный формат email'),
  }),
});

const loginValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().message('Не верно введен email'),
    password: Joi.string().required().min(5).message('Минимальная длина пароля - 8'),
  }),
});

const idValid = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).message('Не верный id'),
  }),
});

const userValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().message('Не верный формат email'),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30)
      .message('Минимальная длина имени - 2'),
  }),
});

const movieIdValid = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(3).message('Не верный id')
      .required(),
  }),
});
const movieValid = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    nameRU: Joi.string().required().min(2),
    nameEN: Joi.string().required().min(2),
    image: Joi.string().required().custom(url),
    trailer: Joi.string().required().custom(url),
    thumbnail: Joi.string().required().custom(url),
    movieId: Joi.string().required(),
  }),
});
module.exports = {
  updateValid,
  loginValid,
  idValid,
  movieValid,
  movieIdValid,
  userValid,
};
