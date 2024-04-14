import path from 'path';
/** @type {import('jest').Config} */
export default {
    transform: {},
    coverageDirectory: path.resolve(import.meta.dirname, 'coverage'),
    coverageReporters: ['html', ['lcov', { projectRoot: import.meta.dirname }], 'text'],
    rootDir: import.meta.dirname,
    projects: ['<rootDir>/packages/cons/jest.config.js', '<rootDir>/packages/avl/jest.config.js'],
};
