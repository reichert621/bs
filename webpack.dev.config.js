const webpack = require('webpack');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const config = require('./webpack.config');

const { plugins = [] } = config;

module.exports = {
  ...config,
  mode: 'development',
  plugins: plugins.concat([
    new BundleAnalyzerPlugin({
      openAnalyzer: false
    })
  ])
};
