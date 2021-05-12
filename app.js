const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');

const NotFoundedError = require('./errors/NotFoundedError');

const DATABASE_URL = require('./utils/configuration');
const limiter = require('./utils/limiter');
const auth = require('./middleware/auth');
const error = require('./middleware/error');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { login, createUser } = require('./controllers/userController');
const { userRoute, articleRoute } = require('./routes/index');

const notFound = require('./utils/constants');

const app = express();
const { PORT = 3000 } = process.env;

app.use(cors()); //enable all cors requests
app.options('*', cors()); //enable pre-flightimg
app.use(requestLogger);
app.use(express.json());
app.use(helmet());
app.use(limiter);

mongoose.connect(DATABASE_URL, {
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
  next(new NotFoundedError(notFound));
});

app.use(errorLogger); //enabling error logger
app.use(errors()); //celebrate error handler
app.use(error); //centralized error handler

app.listen(PORT, () => {
  console.log(`Server started\nApp listening at port ${PORT}`);
});
