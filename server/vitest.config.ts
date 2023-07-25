import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // plugins: [tsconfigPaths()],
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    globals: true,
    root: './',
  },
  mode: 'test',
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }) as any,
  ],
  resolve: {
    alias: {
      '@application': './src/application',
      '@helpers': './src/helpers',
      '@infra': './src/infra',
      '@test': './test',
    },
  },
});
