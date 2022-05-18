const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const resolveRoot = (...p) => path.resolve(__dirname, ...p);

const isDev = process.env.NODE_ENV === 'development';

const DevPlugins = [new ReactRefreshWebpackPlugin({})];

/**
 * @type {webpack.Configuration & WebpackDevServer.Configuration}
 */
const config = {
  context: resolveRoot(),
  mode: process.env.NODE_ENV,
  devtool: isDev ? 'eval-cheap-source-map' : false,
  entry: {
    main: resolveRoot('./src/main'),
    'extends-ts.worker': resolveRoot('./monaco-typescript-worker'),
  },
  output: {
    path: resolveRoot('dist'),
    filename: '[name].js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  devServer: {
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              getCustomTransformers: () => ({
                before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
              }),
              transpileOnly: isDev,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: resolveRoot('index.html'),
      filename: 'index.html',
      inject: 'body',
      chunks: ['main'],
    }),
    new ForkTsCheckerWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new MonacoWebpackPlugin({
      globalAPI: isDev,
      languages: ['typescript'],
    }),
    ...(isDev ? DevPlugins : []),
  ],
};

module.exports = config;
