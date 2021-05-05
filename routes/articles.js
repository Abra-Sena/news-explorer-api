const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articleController');

// returns all articles saved by the user
router.get('/', getArticles);

// creates an article with the passed
// keyword, title, text, date, source, link, and image in the body
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.date().utc().format(['YYYY/MM/DD', 'DD-MM-YYYY']),
      source: Joi.string().required(),
      link: Joi.string().uri().required(),
      image: Joi.string().uri().required()
    })
  }),
  createArticle
);

// deletes the stored article by _id
router.delete(
  '/:articleId',
  celebrate({
    params: Joi.object().keys({
      articleId: Joi.string().hex().length(24).required()
    })
  }),
  deleteArticle
);

const router = express.Router();