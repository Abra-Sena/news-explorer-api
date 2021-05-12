const Article = require('../models/article');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundedError = require('../errors/NotFoundedError');
const UnAuthorizedError = require('../errors/UnAuthorizedError');
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
  return Article.findByIdAndRemove(req.params.articleId)
    .then((article) => {
      console.log('article owner: ', article.owner.toString());
      console.log("Request' User id: ", req.user._id);
      if (!article) {
        throw new NotFoundedError(noSuchID);
      } else if(!article.owner.toString() === req.user._id) {
        throw new UnAuthorizedError(notOwner);
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
