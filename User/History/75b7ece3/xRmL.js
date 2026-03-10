const path = require('path')
const jsConfig = require('../../jsconfig.json')
// eslint-disable-next-line no-undef
const getWebpackAliasFromJSConfig = function getWebpackAliasFromJSConfig(jsConfigPaths = {}, jsConfigBaseUrl = __dirname) {
  const alias = Object.keys(jsConfigPaths)
    .reduce(( currentAlias, pathKey ) => {
      const [aliasKey] = pathKey.split('/')
      const [pathAtJsConfig] = jsConfigPaths[pathKey]

      const [relativePathToDir] = pathAtJsConfig.split('/*')

      const absolutePath = path.resolve(jsConfigBaseUrl, relativePathToDir)

      return {
        ...currentAlias,
        [aliasKey]: absolutePath,
      }
    }, {})

  return alias
}
const alias = getWebpackAliasFromJSConfig(jsConfig.compilerOptions.paths, jsConfig.compilerOptions.baseUrl)

const webpack = require('webpack')
const dotEnvWebpack = require('dotenv-webpack')
const htmlWebpack = require('html-webpack-plugin')
const copyWebpack = require('copy-webpack-plugin')
const vueLoader = require('vue-loader/lib/plugin')
const extractCss = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

let devTool = false
// let styleLoader = 'style-loader'

// eslint-disable-next-line no-undef
const appEnvironment = process.env.NODE_ENV
// if(appEnvironment == 'test' || appEnvironment == 'staging' || appEnvironment == 'prod'){
//   styleLoader = extractCss.loader
// }
if (appEnvironment === 'local') {
  devTool = 'eval' // eval-cheap-module-source-map
}
if (appEnvironment === 'test') {
  // apply source map only for Local and Development build
  // all *.map files will be removed after uploading to
  // sentry for tracking errors on Development deployment
  devTool = 'hidden-source-map'
}

const date = new Date()

const cssLoaders = appEnvironment === 'local' ? ['style-loader'] : [{
  loader: extractCss.loader,
}]

const webpack_base = {
  //===========================================
  // INPUT, OUTPUT
  //-------------------------------------------
  entry: {
    app: [
      './src/app.js',
    ],
  },
  output: {
    path:         '/',
    publicPath:   '/',
    globalObject: 'this',
    filename:     `[name].[contenthash].${date.getTime()}.js`,
  },
  devtool: devTool,
  //===========================================
  // MODULES
  //-------------------------------------------
  module:  {
    rules: [
      {
        // load typescript
        test:    /\.ts$/,
        exclude: /node_modules/,
        loader:  'ts-loader',
        options: {
          transpileOnly:    true, // this option turns off type checking
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        // load vue-component
        test:   /\.vue$/,
        loader: 'vue-loader',
      },
      {
        // load js file & transform js syntax for backwards compatible old browsers/environments
        // this will apply to both plain `.js` files and `<script>` blocks in `.vue` files
        test:    /\.js$/,
        exclude: [/(node_modules)/, '/src/modules/service-worker/offline.js'],
        use:     {
          loader:  'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        // load file
        test:      /\.(png|jpg|gif)$/,
        type:      'asset/resource',
        generator: {
          filename: 'template/images/[contenthash].[ext]',
        },
      },
      {
        test:      /\.(zip|pdf)$/,
        type:      'asset/resource',
        generator: {
          filename: 'files/[name].[ext]',
        },
      },
      {
        // this will apply to plain `.scss`, `.css` files and `<style>` blocks in `.vue` files
        test: /\.(s*)css$/,
        use:  [
          ...cssLoaders,
          {
            // expand for css loading
            loader:  'css-loader',
            options: {
              url:       false,
              sourceMap: true,
            },
          },
          {
            // load sass code
            loader:  'sass-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            // loaded shared scss for both layout-template & vue-component
            loader:  'sass-resources-loader',
            options: {
              url:       false,
              sourceMap: true,
              resources: [
                './src/template/_variables.scss',
                './src/template/_mixin.scss',
              ],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    fallback: {
      fs: false,
    },
    // config for vue-loader
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      ...alias,
    },
    extensions: ['*', 'ts', '.js', '.vue', '.json'],
  },
  //===========================================
  // PLUGINS
  //-------------------------------------------
  plugins: [
    // supports environment variables
    new dotEnvWebpack({
      path: './config/dotenv/app-settings.' + appEnvironment + '.env',
      safe: './config/dotenv/.env.example',
    }),
    // generate html file which serve webpack bundles
    new htmlWebpack({
      template: './src/index.html',
    }),
    // copy static source which app need
    new copyWebpack({
      patterns: [
        { from: './src/public', to: './'},
        { from: './src/template/', to: './template' },
        { from: './src/translate/', to: './translate' },
        { from: './src/modules/service-worker/offline.html', to: './'},
        { from: './src/modules/service-worker/offline.js', to: './sw.js'},
      ],
    }),

    // config for vue-loader
    new vueLoader(),
    // register MiniCssExtractPlugin
    new extractCss({
      ignoreOrder:   true,
      filename:      `[name].[contenthash].${date.getTime()}.css`,
      chunkFilename: `[name].[contenthash].${date.getTime()}.css`,
    }),

    new webpack.DefinePlugin({
      'process.env.RELEASE_VERSION': JSON.stringify(`${appEnvironment}-${process.env.BUILD_ID}`),
    }),

    new ESLintPlugin({
      extensions:  ['js', 'vue'], // Lint JS and Vue files
      exclude:     ['node_modules', 'src/modules/service-worker/offline.js'],
      failOnError: false, // Fail the build if there are ESLint errors
      emitWarning: true, // Show warnings without failing the build
      fix:         false, // Auto-fix issues if possible
    }),
  ],
  optimization: {
    nodeEnv: appEnvironment,
  },
}

module.exports = webpack_base
