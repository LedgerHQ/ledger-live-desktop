const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

require('../src/globals')

const { BUNDLE_ANALYZER } = process.env

module.exports = type => {
  const plugins = [
    new webpack.DefinePlugin({
      __GLOBAL_STYLES__: JSON.stringify(__GLOBAL_STYLES__),
      __DEV__,
      __PROD__,
      'process.env.NODE_ENV': JSON.stringify(__ENV__),
    }),
  ]

  if (BUNDLE_ANALYZER) {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: `../report-${type}.html`,
      }),
    )
  }

  return plugins
}
