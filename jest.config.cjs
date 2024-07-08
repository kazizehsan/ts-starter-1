module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  restoreMocks: true,
  testPathIgnorePatterns: ['node_modules', 'dist/config', 'dist/app.js', '<rootDir>/.aws-sam'],
  coveragePathIgnorePatterns: ['node_modules', 'dist/config', 'dist/app.js', '<rootDir>/.aws-sam'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};
