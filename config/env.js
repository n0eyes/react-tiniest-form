const paths = require('./paths');

const fs = require('fs');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const NODE_ENV = process.env.NODE_ENV;

const isDevelopment = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NODE_ENV === 'production';

const HTTPS = process.env.HTTPS === 'on';

const localhost = 'http://localhost:3000';

const dotenvFiles = [`${paths.dotenv}.local`, `${paths.dotenv}.${NODE_ENV}`, paths.dotenv].filter(
  Boolean,
);

dotenvFiles.forEach(
  file => fs.existsSync(file) && dotenvExpand.expand(dotenv.config({ path: file })),
);

const getClientEnvironment = publicUrl => {
  const raw = Object.keys(process.env).reduce((env, key) => ({ ...env, [key]: process.env[key] }), {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PUBLIC_URL: publicUrl,
  });

  const stringified = {
    'process.env': Object.keys(raw).reduce(
      (env, key) => ({
        ...env,
        [key]: JSON.stringify(raw[key]),
      }),
      {},
    ),
  };

  return { stringified };
};

module.exports = {
  getClientEnvironment,
  isDevelopment,
  isProduction,
  HTTPS,
  localhost,
};
