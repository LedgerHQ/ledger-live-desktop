const { NODE_ENV } = process.env

const __TEST__ = NODE_ENV === 'test'

module.exports = () => ({
  presets: [
    [
      require('@babel/preset-env'),
      {
        loose: true,
        modules: __TEST__ ? 'commonjs' : false,
        targets: {
          electron: '1.8',
          node: 'current',
        },
      },
    ],
    require('@babel/preset-flow'),
    require('@babel/preset-react'),
    require('@babel/preset-stage-0'),
  ],
  plugins: [
    [require('babel-plugin-module-resolver'), { root: ['src'] }],
    [
      require('babel-plugin-styled-components'),
      {
        displayName: true,
        ssr: __TEST__,
      },
    ],
  ],
})
