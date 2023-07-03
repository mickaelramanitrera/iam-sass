import { defineConfig } from 'tsup';

const env = process.env.NODE_ENV;

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  minify: env === 'production',
  bundle: env === 'production',
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
});

