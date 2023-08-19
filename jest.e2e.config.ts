module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testRegex: '.*\\.e2e-spec\\.ts$', // Cela devrait matcher tous les fichiers .e2e-spec.ts
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        /* votre configuration ts-jest ici si nécessaire */
      },
    ],
  },
  testPathIgnorePatterns: ['/node_modules/'],
};
