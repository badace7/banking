module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 10000,
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testRegex: './src/modules/.*/tests/.*\\.(test|spec)?\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  roots: ['<rootDir>/src/modules'],
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  globals: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        compiler: 'ttypescript',
      },
    ],
  },
};
