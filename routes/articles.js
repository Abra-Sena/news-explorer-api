const express = require('express');
const Joi = require('joi').extend(require('@joi/date'));
const { celebrate } = require('celebrate');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articleController');

const router = express.Router();

// returns all articles saved by the user
router.get('/', getArticles);

// creates an article with the passed
// keyword, title, text, date, source, link, and image in the body
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      publishedAt: Joi.string().required(),
      source: Joi.string().required(),
      url: Joi.string().uri().required(),
      urlToImage: Joi.string().uri().required(),
      date: Joi.date().format(['YYYY/MM/DD', 'DD-MM-YYYY']).utc(),
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

module.exports = router;
