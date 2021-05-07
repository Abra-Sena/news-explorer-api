const mongoose = require('mongoose');
const validator = require('validator');

// describes the article schema
const articleSchema = new mongoose.Schema({
  keyword: { //the word by which the articles are searched
    type: String,
    required: true
  },
  title: { //an article title
    type: String,
    required: true
  },
  text: { //the article text
    type: String,
    required: true
  },
  date: { //the article date
    type: Date,
    default: Date.now,
  },
  source: { //the article source
    type: String,
    required: true
  },
  link: { //link to the article
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v, {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        require_protocol: false,
        require_host: true,
        require_valid_protocol: true,
        allow_underscores: true,
        host_whitelist: false,
        host_blacklist: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
        disallow_auth: false,
      }),
      message: 'You must provide a valide URL for the image',
    }
  },
  image: { //link to the image for the article
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v, {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        require_protocol: false,
        require_host: true,
        require_valid_protocol: true,
        allow_underscores: true,
        host_whitelist: false,
        host_blacklist: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
        disallow_auth: false,
      }),
      message: 'You must provide a valide URL for the image',
    }
  },
  owner: { //_id of the user who saved the article
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false // default behavior to unable database to return this field
  }
});

// creates the model and export it
module.exports = mongoose.model('article', articleSchema);