function getArticles(req, res, next) {
  return Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
}

function createArticle(req, res, next) {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new BadRequest('Invalid Data for Card Creation!');
      }

      res.status(201).send(card);
    })
    .catch(next);
}

function deleteArticle(req, res, next) {
  return Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFounded('No card with such ID');
      } else if(!card.owner._id === req.user._id) {
        throw new UnAuthorized('Forbidden! You are not the owner.');
      } else {
        return res.status(200).send(card);
      }
    })
    .catch(next);
}

module.exports = {
  getArticles,
  createArticle,
  deleteArticle
};
