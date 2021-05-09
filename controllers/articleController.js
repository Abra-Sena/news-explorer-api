const Article = require('../models/article');
const BadRequestError = require('../middleware/errors/BadRequestError');
const NotFoundedError = require('../middleware/errors/NotFoundedError');
const UnAuthorizedError = require('../middleware/errors/UnAuthorizedError');

function getArticles(req, res, next) {
  return Article.find({})
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
}

function createArticle(req, res, next) {
  const { keyword, title, text, source, link, image } = req.body;
  console.log("article owner: ", req.user._id);

  return Article.create({ keyword, title, text, source, link, image, owner: req.user._id })
    .then((article) => {
      if (!article) {
        throw new BadRequestError('Invalid Data for Card Creation!');
      }

      res.status(201).send(article);
    })
    .catch(next);
}

function deleteArticle(req, res, next) {
  return Article.findByIdAndRemove(req.params.articleId)
    .then((article) => {
      console.log("article owner: ", article.owner);
      console.log("Request' User id: ", req.user._id);
      if (!article) {
        throw new NotFoundedError('No article with such ID');
      } else if(!article.owner === req.user._id) {
        throw new UnAuthorizedError('Forbidden! You are not the owner.');
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
