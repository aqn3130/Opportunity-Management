module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  "outputDir": "../server/public",
  "devServer": {
    "proxy": {
      "/api": {
        "target": "http://0.0.0.0:80"
      }
    }
  }
};
