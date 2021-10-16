// require('dotenv').config();
const privateKey = 'dev-secret';
const { DATABASE_URL = 'mongodb://localhost:27017/news-explorer' } = process.env;

module.exports = {
  privateKey,
  DATABASE_URL
};
