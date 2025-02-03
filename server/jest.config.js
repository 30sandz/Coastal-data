module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/__tests__/'
    ],
    globalSetup: './__tests__/setup.js',
    globalTeardown: './__tests__/teardown.js',
    setupFilesAfterEnv: ['./__tests__/setupAfterEnv.js']
}; 