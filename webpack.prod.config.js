const webpack = require('webpack');
const config = require('./webpack.config');

module.exports = {
  ...config,
  mode: 'production'
};
