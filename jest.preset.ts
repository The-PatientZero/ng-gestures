export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'mjs', 'html'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json'
      }
    ]
  },
  collectCoverageFrom: ['packages/*/src/**/*.{ts,tsx}', '!packages/*/src/**/*.d.ts', '!packages/*/src/test-setup.ts'],
  coverageReporters: ['text', 'lcov', 'html'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  modulePathIgnorePatterns: ['/dist/']
};
