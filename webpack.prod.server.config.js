const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const originalWebpackConfig = require("./webpack.dev.server.config");
const TerserPlugin = require("terser-webpack-plugin");
const browserSpecificSetting = {
  mode: "development",
  entry: ["@babel/polyfill", "./server/prodHandler.tsx"],
  optimization: {
    nodeEnv: "production",
  },
  plugins: [new LodashModuleReplacementPlugin()],
};

const webpackOptionsForBrowser = { ...originalWebpackConfig, ...browserSpecificSetting };

module.exports = webpackOptionsForBrowser;
