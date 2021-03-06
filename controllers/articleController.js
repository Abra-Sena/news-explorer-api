const Article = require('../models/article');
const BadRequestError = require('../errors/BadRequestError');
const Forbidden = require('../errors/Forbidden');
const NotFoundedError = require('../errors/NotFoundedError');
const { badRequest, noSuchID, notOwner} = require('../utils/constants');

function getArticles(req, res, next) {
  return Article.find({ owner: req.user._id })
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
}

function createArticle(req, res, next) {
  const { keyword, title, description, publishedAt, source, url, urlToImage } = req.body;
  console.log('article owner: ', req.user._id);

  return Article.create({ keyword, title, description, publishedAt, source, url, urlToImage, owner: req.user._id })
    .then((article) => {
      if (!article) {
        throw new BadRequestError(badRequest);
      }

      res.status(201).send(article);
    })
    .catch(next);
}

function deleteArticle(req, res, next) {
  return Article.findById(req.params.articleId)
    .select('+owner')
    .then((article) => {
      if (!article) {
        throw new NotFoundedError(noSuchID);
      }

      if (String(article.owner) !== req.user._id) {
        throw new Forbidden(notOwner);
      }

      return Article.deleteOne(article).then(() => {
        res.status(200).send({message: 'Article sucessfully removed'});
      });
    })
    .catch(next);
}

module.exports = {
  getArticles,
  createArticle,
  deleteArticle
};
