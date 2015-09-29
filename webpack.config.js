var HtmlWebpackPlugin  = require('html-webpack-plugin');

module.exports = {
  entry: './src/main',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      { test: /\.scss$/, loader: 'style!css!sass' },
      { test: /\.css$/, loader: 'style!css' },
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    title: 'Cloth Simulation'
  })]
};
