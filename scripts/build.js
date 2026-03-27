/**
 * @file The Bun single file executable build script.
 */

import process from 'node:process';

await Bun.build({
  compile: process.argv[2] ?? true,
  entrypoints: ['src/index.js'],
  outdir: 'dist/',
  minify: true
});
