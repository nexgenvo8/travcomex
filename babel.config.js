// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
//   plugins: [
//     'react-native-reanimated/plugin',  // Keep this at the end of the plugin list
//   ],

// };

module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-transform-runtime', {regenerator: true}],
    'react-native-reanimated/plugin',
  ],
};
