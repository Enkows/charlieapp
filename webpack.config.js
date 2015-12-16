module.exports = {
  entry: './renderer/App.jsx',
  target: 'atom',
  output: {
    path: './static',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'uglify!babel-loader'
    }]
  }
}
