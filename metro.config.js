const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Add resolver for node modules polyfills
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  assert: path.resolve(__dirname, "node_modules/assert"),
};

module.exports = withNativeWind(config, { input: "./global.css" });
