module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: './test/.*\\.(test|spec)?\\.(js|ts)$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  roots: ['<rootDir>/test'],
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      compiler: 'ttypescript',
    },
  },
};
