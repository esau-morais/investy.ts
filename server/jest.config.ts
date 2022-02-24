export default {
  clearMocks: true,
  coverageProvider: 'v8',
  testMatch: ['**/?(*.)+(spec).[tj]s?(x)'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
  },
};
