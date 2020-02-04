const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkerPlugin = require('worker-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const package = require('./package.json')

module.exports = {
  entry: {
    index: './src/index.ts',
    simple: './src/simple.ts',
    each: './src/each.ts',
    worker: './src/data.worker.ts',
    vendor: Object.keys(package.dependencies),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Index',
      chunks: ['vendor', 'index'],
      template: 'src/index.html',
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      title: 'Simple',
      chunks: ['vendor', 'simple'],
      template: 'src/simple.html',
      filename: 'simple.html',
    }),
    new HtmlWebpackPlugin({
      title: 'Each',
      chunks: ['vendor', 'each'],
      template: 'src/each.html',
      filename: 'each.html',
    }),
    new WorkerPlugin({
      globalObject: 'self',
    }),
    new CopyPlugin([
      {from: 'icons', to: 'icons'},
      {from: 'data/*.json'},
      {from: 'manifest.json'},
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
};
