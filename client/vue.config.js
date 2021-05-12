let API_URL = 'http://0.0.0.0:80';
if (process.env.NODE_ENV === 'development') API_URL = 'http://127.0.0.1:3333';
module.exports = {
  transpileDependencies: ['vuetify'],
  outputDir: '../server/public',
  devServer: {
    proxy: {
      '/api': {
        target: API_URL
      }
    }
  }
};
