const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { container } = require('webpack');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/iframe-integrator'),
  },
  devServer: {
    port: 4444,
  },
  plugins: [
    new container.ModuleFederationPlugin({
      name: 'IframeIntegrator',
      filename: 'remoteEntry.js',
      exposes: {
        Main: 'apps/iframe-integrator/src/main.ts',
      },
    }),
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'swc',
      main: './src/main.ts',
      index: './src/index.html',
      baseHref: '/',
      assets: ['./src/favicon.ico', './src/assets'],
      styles: ['./src/styles.css'],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    }),
  ],
};
