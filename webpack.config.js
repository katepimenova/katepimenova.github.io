module.exports = {
  entry: "./js/app.js",
    output: {
      path: require('path').join(__dirname, '/build/'),
      publicPath: '/build/',
      filename: 'bundle.js'
    },
    module: {
      loaders: [
        {
            test: /\.js$/,
            loader: 'babel',
            exclude: [/node_modules\//, /\/expression\/parser\.js$/],
            query: {
              plugins: ['transform-runtime', 'transform-es2015-modules-commonjs'],
              presets: ['es2015-webpack', 'react']
            }
        },
        {test: /\.less$/, loader: 'style!css!postcss!less'},
      ]
    }
};