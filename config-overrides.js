const { override, addWebpackResolve, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
  addWebpackResolve({
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "assert": require.resolve("assert/"),
      "buffer": require.resolve("buffer/"),
      "vm": require.resolve("vm-browserify"),
      "process": require.resolve("process/browser"),
      "http": require.resolve("stream-http"),         // Добавляем для http
      "https": require.resolve("https-browserify"),   // Добавляем для https
      "os": require.resolve("os-browserify/browser")  // Добавляем для os
    }
  }),
  addWebpackPlugin(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'] // Делаем Buffer глобальным
    })
  )
);