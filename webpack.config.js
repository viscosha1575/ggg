const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  // другие настройки
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
};

module.exports = {
  entry: './src/index.js',  // Убедись, что путь правильный
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
 /* mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 8080,
  },*/
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};