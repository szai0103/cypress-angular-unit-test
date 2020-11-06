import * as wp from '@cypress/webpack-preprocessor';
const helpers = require('./helpers');
import { Configuration, ContextReplacementPlugin, DefinePlugin } from 'webpack';
const path = require('path');
const AngularCompilerPlugin = require('@ngtools/webpack');
import { getWorkspaceRaw } from '@angular/cli/utilities/config';
import * as fs from 'fs';

const obj = JSON.parse(getWorkspaceRaw('local')[0].text);
const styles = obj.projects['angular-project']['architect']['build']['options']['styles'];
console.log(fs.readFileSync(styles[1], 'utf8'));

const webpackOptions: Configuration = {
  mode: 'development',
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['./', helpers.root('src'), 'node_modules']
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
          helpers.root('node_modules/@angular')
        ]
      },
      {
        test: /\.ts$/,
        // loaders: ['ts-loader', 'angular2-template-loader'],
        loader: '@ngtools/webpack',
      },
      {
        // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
        // Removing this will cause deprecation warnings to appear.
        test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
        parser: { system: true },
      },
      {
        test: /(\.css|\.scss|\.sass)$/,
        use: [
          'to-string-loader',
          'css-loader',
          'sass-loader'
        ],
        exclude: [helpers.root('src/index.html')]
      },
      {
        enforce: 'post',
        test: /\.(js|ts)$/,
        loader: 'istanbul-instrumenter-loader',
        query: {
          esModules: true
        },
        include: helpers.root('src'),
        exclude: [/\.(e2e|spec)\.ts$/, /node_modules/]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'file-loader?name=assets/images/[name].[ext]'
      },
      {
        test: /\.(mp4|webm|ogg)$/i,
        loader: 'file-loader?name=assets/videos/[name].[ext]'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?limit=10000&mimetype=image/svg+xml&name=assets/svgs/[name].[ext]'
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        loader: 'file-loader?prefix=font/&limit=5000&name=assets/fonts/[name].[ext]'
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'file-loader?prefix=font/&limit=5000&name=assets/fonts/[name].[ext]'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?limit=10000&mimetype=application/octet-stream&name=assets/fonts/[name].[ext]'
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'test')
    }),
    new ContextReplacementPlugin(
      /\@angular(\\|\/)core(\\|\/)f?esm5/, path.join(__dirname, './src')
    ),
    new AngularCompilerPlugin.AngularCompilerPlugin({
      tsConfigPath: './tsconfig.spec.json',
      directTemplateLoading: true,
      skipCodeGeneration: true
    })
  ],
  performance: {
    hints: false
  },
  node: {
    global: true,
    crypto: 'empty',
    process: false,
    module: false,
    clearImmediate: false,
    setImmediate: false,
    fs: 'empty'
  }
};

module.exports = wp({
  webpackOptions
});