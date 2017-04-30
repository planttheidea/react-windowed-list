'use strict';

const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  cache: false,

  devtool: '#source-map',

  entry: [
    path.resolve(__dirname, 'src', 'index.js')
  ],

  externals: {
    react: {
      amd: 'react',
      commonjs: 'react',
      commonjs2: 'react',
      root: 'React'
    },
    'react-dom': {
      amd: 'react-dom',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      root: 'ReactDOM'
    },
    remeasure: {
      amd: 'remeasure',
      commonjs: 'remeasure',
      commonjs2: 'remeasure',
      root: 'Remeasure'
    }
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'eslint-loader',
        options: {
          configFile: '.eslintrc',
          failOnError: true,
          failOnWarning: false,
          formatter: eslintFriendlyFormatter
        },
        test: /\.js$/
      }, {
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'babel-loader',
        options: {
          babelrc: false,
          env: {
            production: {
              plugins: [
                'transform-react-remove-prop-types'
              ]
            }
          },
          plugins: [
            'transform-decorators-legacy'
          ],
          presets: [
            ['env', {
              loose: true,
              targets: {
                browsers: [
                  'last 2 versions',
                  'ie 11'
                ]
              }
            }],
            'react',
            'stage-2'
          ]
        },
        test: /\.js$/
      }
    ]
  },

  output: {
    filename: 'react-windowed-list.js',
    library: 'WindowedList',
    path: path.resolve(__dirname, 'dist'),
    umdNamedDefine: true
  },

  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ]),
    new LodashModuleReplacementPlugin()
  ]
};
