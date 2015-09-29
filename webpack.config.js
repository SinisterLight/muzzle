module.exports = {
  entry: './js/app.jsx',
  output: {
    filename: './js/bundle.js'
  },
  devtool: 'source-map',
  module: {
    preLoaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loader: "eslint-loader"}
    ],
    loaders: [
      {test: /\.css$/, loaders: ['style', 'css']},
      {test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  },
  eslint: {
    configFile: './.eslintrc'
  }
}
