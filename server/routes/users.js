var express = require('express');
var router = express.Router();
const { QueryTypes } = require('sequelize');
const { User, sequelize } = require('../models');
const { asyncErrorHandler, userHandler } = require('../routeUtils');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/login', asyncErrorHandler(async function (req, res, next) {
  const { login, password } = req.body;
  if (!login || !password || typeof login !== 'string' || typeof password !== 'string'){
    res.status(400).send('Not empty login and password strings needed in json body');
    next();
  }
  const user = await User.findByPk(login);
  if (!user){
    res.status(400).send('Absent login');
    next('route');
  }
  if (!(await user.checkPassword(password))){
    res.status(400).send('Wrong password');
    next('route');
  };
  const { type } = user
  res.json({
    token: await user.makeToken(),
    user: { login, type },
  });
  // next();
}));

router.post('/register', asyncErrorHandler(async function (req, res, next) {
  const { login, password } = req.body;
  if (!login || !password || typeof login !== 'string' || typeof password !== 'string'){
    res.status(400).send('Not empty login and password strings needed in json body');
    next('route');
  }
  if (await User.findByPk(login)) {
    res.status(403).send('Busy login');
    next('route');
  }
  const user = User.build({ login, type: 'user' });
  await user.setPassword(password);
  await user.save();
  const { type } = user
  res.json({ login, type });
  // next();
}));

router.get('/my-info', userHandler(), function (req, res, next) {
  const { login, type } = req.user;
  res.json({ login, type });
});

router.get('/user-info/:login', userHandler(['admin']), asyncErrorHandler(async function (req, res, next) {
  const user = await (User.findByPk(req.params.login));
  if (!user) {
    res.status(404).send('Login not found');
    next('route');
  }
  const { login, type } = user;
  res.json({ login, type });
  // next();
}));

router.get('/list-logins', userHandler(['admin']), asyncErrorHandler(async function (req, res, next) {
  const users = await sequelize.query('SELECT "login" FROM "Users"', { type: QueryTypes.SELECT });
  // console.log(users);
  res.json(users.map(({ login }) => login));
  // res.json(users);
  // next('route');
}));

module.exports = router;
