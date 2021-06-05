const Article = require('../models/article');
const BadRequestError = require('../errors/BadRequestError');
const Forbidden = require('../errors/Forbidden');
const NotFoundedError = require('../errors/NotFoundedError');
const { badRequest, noSuchID, notOwner} = require('../utils/constants');

function getArticles(req, res, next) {
  return Article.find({})
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
}

function createArticle(req, res, next) {
  const { keyword, title, text, source, link, image } = req.body;
  console.log('article owner: ', req.user._id);

  return Article.create({ keyword, title, text, source, link, image, owner: req.user._id })
    .then((article) => {
      if (!article) {
        throw new BadRequestError(badRequest);
      }

      res.status(201).send(article);
    })
    .catch(next);
}

function deleteArticle(req, res, next) {
  const owner = Article.theOwner(req.params.articleId);

  return Article.findByIdAndRemove(req.params.articleId)
    .then((article) => {
      if (!article) {
        throw new NotFoundedError(noSuchID);
      } else if (owner.toString() !== req.user._id) {
        throw new Forbidden(notOwner);
      } else {
        return res.status(200).send(article);
      }
    })
    .catch(next);
}

module.exports = {
  getArticles,
  createArticle,
  deleteArticle
};
