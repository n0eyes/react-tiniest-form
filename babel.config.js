module.exports = {
  presets: [
    'react-app',
    ['@babel/preset-env', { loose: true, modules: false }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
};
