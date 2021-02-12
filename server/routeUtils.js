// const jwt = require('jsonwebtoken');
var debug = require('debug')('server:server');
// const secret = process.env.SECRET || SgxLbntQGfukf1yEAYZyzLBJKvop8Z2k6q1YG0wOHXZMgbVNhhsLaSIOB8Rkw9Pe4anRpTAE8h95RCwDYLjSsbJhpdZruVKzpzGgw1bnqCLLS1gAU1R1uChtRYDkSBOoZkFdnG3sRVLtJz63gqEQkq7owtaACYOXAd1fPOFkUgwgxammROY1NgpmUJR9YOwhVtcq5mTu;
const { User } = require('./models');
const { verifyToken } = require('./tokenUtils');
// const models = require('./models');
// console.log(models); // {} - ???

// const verifyToken = async (token) => new Promise((resolve, reject) => jwt.verify(token, secret, (err, decoded) => err ? reject(err) : resolve(decoded)));
// const signToken = async (payload, options = { expiresIn: '365d' }) => new Promise((resolve, reject) => jwt.sign(payload, secret, options, (err, token) => err ? reject(err) : resolve(token)));
const asyncErrorHandler = (asyncFn, ...args) => async (req, res, next) => {
  try {
    await asyncFn(req, res, next, ...args);
    // next();
  } catch (e) {
    debug(e);
    res.status(500).send(e);
  }
}
const userHandler = (allowedTypes) => asyncErrorHandler(async (req, res, next) => {
  const autHeader = req.get('Authorization');
  if (!autHeader) {
    res.status(401).send('Unauthorized');
    next('route');
  }
  const autSplit = autHeader.split && autHeader.split(' ');
  if (!autSplit || autSplit.length !== 2 || !(autSplit[0] === 'Token' || autSplit[0] === 'Bearer')) {
    res.status(401).send('Wrong format of authorisation');
    next('route');
  }
  const token = autSplit[1];
  // console.log('here');
  let decodedToken;
  try {
    decodedToken = await verifyToken(token);
  } catch (e) {
    debug(e);
    res.status(403).send(`Wrong token! ${e.name + ': ' + e.message}`);
    next('route');
  }
  const { login } = decodedToken;
  const user = await User.findByPk(login);
  if (!user) {
    res.status(403).send('Wrong user');
    next('route');
  }
  req.user = user;
  if (allowedTypes && allowedTypes.indexOf && allowedTypes.indexOf(user.type) === -1) {
    // console.log('here');
    res.status(403).send('Not allowed user type');
    next('route');
  }
  next();
});

module.exports = { /* verifyToken, signToken, */ asyncErrorHandler, userHandler }