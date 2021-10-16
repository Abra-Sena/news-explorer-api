require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/UnAuthorizedError');
const { privateKey } = require('../utils/configuration');
const { authError } = require('../utils/constants');

const {NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnAuthorizedError(authError);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : privateKey);
  } catch(err) {
    throw new UnAuthorizedError(authError);
  }

  req.user = payload;
  next();
};
