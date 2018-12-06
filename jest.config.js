module.exports = {
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/.vscode/',
    '<rootDir>/routes/redirector'
  ],
  collectCoverage: true,
  coverageReporters: ['text-lcov'],
  bail: true,
  verbose: true
};
