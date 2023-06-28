import { defineConfig } from 'vitest/config';

export default defineConfig({
  // plugins: [tsconfigPaths()],
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
  mode: 'test',
  resolve: {
    alias: {
      '@application': './src/application',
      '@helpers': './src/helpers',
      '@infra': './src/infra',
      '@test': './test',
    },
  },
});
