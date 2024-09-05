import { defineConfig } from 'tsup';
export default defineConfig({
  entryPoints: ['src/index.ts'],
  format: ['cjs', 'esm'],
  experimentalDts: true,
  outDir: 'lib',
  target: ['es2017', 'node16'],
  clean: false,
});
