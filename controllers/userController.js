const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../middleware/errors/BadRequestError');
const NotFoundedError = require('../middleware/errors/NotFoundedError');
const UnAuthorizedError = require('../middleware/errors/UnAuthorizedError');

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
        throw new NotFoundedError('User ID not found');
      }
      return res.status(200).send(user);
    })
    .catch(next);
}

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if(!user) throw new NotFoundedError('Current User not found!');

      res.send({ data: user});
    })
    .catch(next);
}

function createUser(req, res, next) {
  const { email, password, name } = req.body;
  //check email andd password validity
  if(!email || !password) {
    throw new BadRequestError('Please enter a valid email or password');
  }

  //hash password before saving to database
  return bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ email, password: hash, name })
        .then((user) => {
          if(!user) throw new BadRequestError('Invalid Data!');

          res.status(201).send({
            _id: user._id,
            email: user.email,
            name: user.name
          });
        })
        .catch((err) => {
          if (err.name === 'MongoError' && err.code === 11000) {
            res.status(409).send({ message: 'A user already exist with this email!' });
          }
        });
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotFoundedError('This User does not exist!');
      }

      const token = jwt.sign(
        {
          _id: user._id
        },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d'
        }
      );

      res.send({ token });
    })
    .catch((err) => {
      if (res.status(401)) {
        next(new UnAuthorizedError('Incorrect email or password'));
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
