const movieRouter = require('express').Router();

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movie');
const {
  movieIdValid,
  movieValid,
} = require('../middlewares/valid');

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', movieValid, createMovie);
movieRouter.delete('/movies/:movieId', movieIdValid, deleteMovie);

module.exports = movieRouter;
