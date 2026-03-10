const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const webpackBase = require('./webpack.base.js')

// apply for environments: local
const compileProgressHandler = (percentage, message, ...args) => {
  // e.g. Output each progress message directly to the console:
  // eslint-disable-next-line no-console
  if (percentage * 100 % 5 === 0) {
    console.info(parseFloat(percentage * 100).toFixed() + '%', message, ...args)
  }
}

const webpackLocal = {
  mode:         'development',
  //===========================================
  // DEV SERVER
  //-------------------------------------------
  watchOptions: {
    ignored: /node_modules/,
  },
  devServer: {
    static: {
      // eslint-disable-next-line no-undef
      directory: path.join(__dirname, '../../dist'),
    },
    client: {
      overlay: {
        errors:   true,
        warnings: false,
      },
    },
    hot:                true,
    allowedHosts:       'all',
    historyApiFallback: true,
  },
  //===========================================
  // PLUGINS
  //-------------------------------------------
  plugins: [
    new webpack.ProgressPlugin(compileProgressHandler),
  ],
}

module.exports = merge(webpackBase, webpackLocal)
