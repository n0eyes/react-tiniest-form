const isDevelopment = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  presets: [
    'react-app',
    ['@babel/preset-env', { loose: true, modules: false }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
};
