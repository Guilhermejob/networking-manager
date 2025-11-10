/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^nanoid/non-secure$': '<rootDir>/tests/__mocks__/nanoid/non-secure.ts',
  },
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
