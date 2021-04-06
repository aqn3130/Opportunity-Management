module.exports = {
  transpileDependencies: ["vuetify"],
  outputDir: "../server/public",
  devServer: {
    proxy: {
      "/api": {
        // target: "http://127.0.0.1:3333"
        target: "http://0.0.0.0:80"
      }
    }
  }
};
