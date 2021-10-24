const router = require('express').Router();
const NotFoundError = require('../errors/not-found');

const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { login, createUser } = require('../controllers/users');

const {
  userValid,
  loginValid,
} = require('../middlewares/valid');

router.post('/signin', loginValid, login);
router.post('/signup', userValid, createUser);
router.use(auth);
router.use('/', usersRouter);
router.use('/', moviesRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});
module.exports = router;
