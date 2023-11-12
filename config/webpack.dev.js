const paths = require('./paths.js');
const { HTTPS } = require('./env.js');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const fs = require('fs');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    historyApiFallback: true,
    port: 3000,
    ...(HTTPS
      ? {
          server: {
            type: 'https',
            options: {
              key: fs.readFileSync(paths.localhostKey),
              cert: fs.readFileSync(paths.cert),
            },
          },
        }
      : {}),
  },
});
