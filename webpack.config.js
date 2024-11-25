'use strict';

// https://penx.medium.com/managing-dependencies-in-a-node-package-so-that-they-are-compatible-with-npm-link-61befa5aaca7

const path = require('path');

module.exports = {
  mode: 'development', // 'production'
  entry: path.resolve(__dirname,'./src/app/main.tsx'),
  output: {
    path: path.resolve(__dirname,'./build/app/'),
    filename: 'app.[contenthash].js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
    },
    fallback: {
      crypto: false, // provided by browser
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  cache: {
    type: 'filesystem',
  },
}