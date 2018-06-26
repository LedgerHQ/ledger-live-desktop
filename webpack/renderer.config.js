const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const plugins = require('./plugins')
const resolve = require('./resolve')
const rules = require('./rules')

const getOptimization = env => {
  const optimization = {
    minimizer: [
      // Default Config without mangling
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          mangle: false,
          compress: {
            ecma: 7,
          },
        },
      }),
    ],
  }
  return env === 'production' ? optimization : undefined
}

const config = {
  mode: __ENV__,
  plugins: [...plugins('renderer'), new HardSourceWebpackPlugin()],
  resolve,
  module: {
    rules,
  },
  devServer: {
    historyApiFallback: true,
  },
  optimization: {
    ...getOptimization(__ENV__),
  },
}

if (__DEV__) {
  Object.assign(config, {
    output: {
      publicPath: '/',
    },
  })
}

module.exports = config
