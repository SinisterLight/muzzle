module.exports = {
    entry: './entry.js',
    output: {
	filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
	loaders: [
	    { test: /\.css$/, loaders: ['style', 'css']},
	    { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader"}
	],
	postLoaders: [
	    {test: /\.jsx?$/, exclude: /node_modules/, loader: 'jshint-loader'}
	]
    }
}
