// Jest setup file for custom ESLint rules testing
// This file is run before each test file

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}
