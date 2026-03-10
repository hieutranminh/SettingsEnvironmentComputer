const path = require('path')
const fs = require('fs')
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

// Check if SSL certificates exist for HTTPS
// eslint-disable-next-line no-undef
const certPath = path.join(__dirname, '../../certs/cert.pem')
// eslint-disable-next-line no-undef
const keyPath = path.join(__dirname, '../../certs/key.pem')
const hasSSLCerts = fs.existsSync(certPath) && fs.existsSync(keyPath)

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
    host:               '0.0.0.0', // Allow access from network devices
    // Enable HTTPS if certificates exist
    ...(hasSSLCerts && {
      server: {
        type:    'https',
        options: {
          key:  fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
        },
      },
    }),
  },
  //===========================================
  // PLUGINS
  //-------------------------------------------
  plugins: [
    new webpack.ProgressPlugin(compileProgressHandler),
  ],
}

module.exports = merge(webpackBase, webpackLocal)
