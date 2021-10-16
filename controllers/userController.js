require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundedError = require('../errors/NotFoundedError');
const UnAuthorizedError = require('../errors/UnAuthorizedError');
const { privateKey } = require('../utils/configuration');
const { badRequest, duplicate, loginError, noSuchID, noSuchUser, notFound, wrongEmail } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

function getUsers(req, res, next) {
  return User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
}

function getOneUser(req, res, next) {
  return User.findById(req.params.id === 'me' ? req.user._id : req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundedError(noSuchID);
      }
      return res.status(200).send(user);
    })
    .catch(next);
}

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if(!user) throw new NotFoundedError(notFound);

      res.send({ data: user});
    })
    .catch(next);
}

function createUser(req, res, next) {
  const { email, password, name } = req.body;
  //check email andd password validity
  if(!email || !password) {
    throw new BadRequestError(wrongEmail);
  }

  //hash password before saving to database
  return bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ email, password: hash, name })
        .then((user) => {
          if(!user) throw new BadRequestError(badRequest);

          res.status(201).send({
            _id: user._id,
            email: user.email,
            name: user.name
          });
        })
        .catch((err) => {
          if (err.name === 'MongoError' && err.code === 11000) {
            res.status(409).send({ message: duplicate });
          }
        });
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotFoundedError(noSuchUser);
      }

      const token = jwt.sign(
        {
          _id: user._id
        },
        NODE_ENV === 'production' ? JWT_SECRET : privateKey,
        {
          expiresIn: '7d'
        }
      );

      res.send({ token });
    })
    .catch((err) => {
      if (res.status(401)) {
        next(new UnAuthorizedError(loginError));
      } else next(err);
    });
}

module.exports = {
  getUsers,
  getOneUser,
  createUser,
  getCurrentUser,
  login
};
