const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
// const config = {};
const config = {
    server: {
      watch: {
        usePolling: true,     // Enable polling for file watching
        interval: 1000,   
        ignored: /node_modules/,    // Set polling interval (default: 1000ms)
      },
    },
  };

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
