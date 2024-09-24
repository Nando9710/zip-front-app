module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  maxWorkers: 4,
  collectCoverage: true,
  roots: ['<rootDir>'],
  moduleDirectories: [
    './node_modules'
  ],
  moduleNameMapper: {
    '^@services/(.*)$': '<rootDir>/src/app/core/services/$1',
    '^@constants/(.*)$': '<rootDir>/src/app/core/constants/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/app/core/interfaces/$1',
    '^@guards/(.*)$': '<rootDir>/src/app/core/guards/$1',
    '^@classes/(.*)$': '<rootDir>/src/app/core/classes/$1',
    '^@pipes/(.*)$': '<rootDir>/src/app/core/pipes/$1',
    '^@animations/(.*)$': '<rootDir>/src/app/core/animations/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@components/(.*)$': '<rootDir>/src/app/components/$1',
    '^@pages/(.*)$': '<rootDir>/src/app/pages/$1',
    '^@interceptors/(.*)$': '<rootDir>/src/app/core/interceptors/interceptors/$1',
    '^@env': '<rootDir>/src/environments/environment.ts',
  }
};
