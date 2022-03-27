const presets = [
  ['@babel/preset-env', { targets: { node: 'current' } }],
  '@babel/preset-react',
  '@babel/preset-typescript',
]

const plugins = [
  [
    'babel-plugin-transform-vite-meta-env',
    'babel-plugin-transform-import-meta',
  ],
]

module.exports = { presets, plugins }
