const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');

const auth = require('./middleware/auth');
const userRoute = require('./routes/users');
const articleRoute = require('./routes/articles');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { login, createUser } = require('./controllers/userController');

const NotFoundedError = require('./middleware/errors/NotFoundedError');

const app = express();
const { PORT = 3000 } = process.env;

app.use(cors()); //enable all cors requests
app.options('*', cors()); //enable pre-flightimg
app.use(requestLogger);
app.use(express.json());
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/news-explorer', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// creates a user with the passed email, password, and name in the body
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30)
    }).unknown(true)
  }),
  createUser
);

// checks the email and password passed in the body and returns a JWT
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required()
    }).unknown(true)
  }),
  login
);

// connecting routes
app.use(auth);
app.use('/users', userRoute);
app.use('/articles', articleRoute);

// errors handling
app.get('*', (req, res, next) => {
  next(new NotFoundedError('Requested resource not found'));
});

app.use(errorLogger); //enabling error logger
app.use(errors()); //celebrate error handler
//centralized error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occured on the server' : message
  });

  next();
});

app.listen(PORT, () => {
  console.log(`Server started\nApp listening at port ${PORT}`);
});
