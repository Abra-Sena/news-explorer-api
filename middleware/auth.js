const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('./errors/UnAuthorizedError');

const {NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnAuthorizedError('Authorization required. No auth!');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch(err) {
    throw new UnAuthorizedError('Authorization required. No auth!');
  }

  req.user = payload;
  next();
};