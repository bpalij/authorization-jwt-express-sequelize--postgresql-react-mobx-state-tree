const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || SgxLbntQGfukf1yEAYZyzLBJKvop8Z2k6q1YG0wOHXZMgbVNhhsLaSIOB8Rkw9Pe4anRpTAE8h95RCwDYLjSsbJhpdZruVKzpzGgw1bnqCLLS1gAU1R1uChtRYDkSBOoZkFdnG3sRVLtJz63gqEQkq7owtaACYOXAd1fPOFkUgwgxammROY1NgpmUJR9YOwhVtcq5mTu;

const verifyToken = async (token) => new Promise((resolve, reject) => jwt.verify(token, secret, (err, decoded) => err ? reject(err) : resolve(decoded)));
const signToken = async (payload, options = { expiresIn: '7d' }) => new Promise((resolve, reject) => jwt.sign(payload, secret, options, (err, token) => err ? reject(err) : resolve(token)));

module.exports = { verifyToken, signToken };