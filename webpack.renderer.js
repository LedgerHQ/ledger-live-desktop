const webpack = require('webpack')

require('./src/globals')

module.exports = {
  output: {
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__,
      __PROD__,
    }),
  ],
  devServer: {
    historyApiFallback: true,
  },
}
