export default {
  displayName: 'angular',
  preset: '../../jest.preset.ts',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  coverageDirectory: '../../coverage/packages/angular',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        isolatedModules: false
      }
    ]
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment'
  ],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/test-setup.ts'],
  testEnvironment: 'jsdom',
  snapshotFormat: { escapeString: true, printBasicPrototype: true }
};
