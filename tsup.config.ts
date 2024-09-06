import { defineConfig } from 'tsup';

export default defineConfig({
  bundle: true,
  entryPoints: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  outDir: 'lib',
  platform: 'neutral',
  clean: false,
});
