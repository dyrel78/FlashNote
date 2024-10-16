// export default {
//     transform: {
//       "^.+\\.js$": "babel-jest"
//     }
//   };

// export default {
//   transform: {},
//   testEnvironment: 'node',
//   extensionsToTreatAsEsm: ['.js'],
// };

// export default { transform: {} } // this is working



// jest.config.mjs
export default {
  transform: {},
  testEnvironment: 'node',
  testTimeout: 10000,
  verbose: true,
  detectOpenHandles: true,
  forceExit: true
};