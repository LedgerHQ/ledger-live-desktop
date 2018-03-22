const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const pkg = require('../package.json')
require('../src/globals')

const { BUNDLE_ANALYZER } = process.env

module.exports = type => {
  const plugins = [
    new webpack.DefinePlugin({
      __APP_VERSION__: JSON.stringify(pkg.version),
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
