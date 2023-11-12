const paths = require('./paths');
const { getClientEnvironment, isDevelopment, isProduction } = require('./env');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const { DefinePlugin } = require('webpack');

const PUBLIC_PATH = '/';

const env = getClientEnvironment(PUBLIC_PATH);

/** @type {import('webpack').Configuration} */
module.exports = {
  context: __dirname,
  entry: paths.appIndex,
  output: {
    filename: '[name].[chunkhash].js',
    path: paths.appOutput,
    clean: true,
  },
  resolve: {
    extensions: paths.moduleFileExtensions.map(e => `.${e}`),
    alias: {
      '@': paths['alias@'],
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(png|gif|svg|jpg|jpeg|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new DefinePlugin({ ...env.stringified, isDevelopment, isProduction }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: paths.appTsConfig,
      },
    }),
  ],
  watchOptions: {
    ignored: ['.yarn', '**/node_modules'],
  },
};
