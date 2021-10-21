const userRouter = require('express').Router();

const {
  getMe, reloadProfile,
} = require('../controllers/users');
const {
  updateValid,
} = require('../middlewares/valid');

userRouter.get('/users/me', getMe);
userRouter.patch('/users/me', updateValid, reloadProfile);

module.exports = userRouter;
