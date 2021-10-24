const Movie = require('../models/movie');
const SomethingWrong = require('../errors/something-wrong');
const NotFoundError = require('../errors/not-found');
const ForbiddenError = require('../errors/forbiddenError');

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не надйен');
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Ошибка авторизации');
      } else {
        movie.remove().then(() => res.send({ message: movie }))
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new SomethingWrong('Введены некорректные данные'));
            } else { next(err); }
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new SomethingWrong('Введены некорректные данные'));
      } else { res.send({ err }); }
    });
};

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })

    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new SomethingWrong('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
