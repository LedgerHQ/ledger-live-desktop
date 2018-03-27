const { NODE_ENV } = process.env

const presets = [
  [
    '@babel/preset-env',
    {
      loose: true,
      modules: NODE_ENV === 'test' ? 'commonjs' : false,
      targets: {
        electron: '1.8',
        node: 'current',
      },
    },
  ],
  '@babel/preset-flow',
  '@babel/preset-react',
  '@babel/preset-stage-0',
]

const plugins = [
  ['babel-plugin-module-resolver', { root: ['src'] }],
  [
    'babel-plugin-styled-components',
    {
      displayName: NODE_ENV === 'development',
      minify: NODE_ENV === 'production',
    },
  ],
]

module.exports = {
  presets,
  plugins,
  env: {
    test: {
      presets,
      plugins,
    },
  },
}
