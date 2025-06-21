import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';


export default defineConfig([
  {
    input: 'src/index.ts',
    output: {
		  file: 'dist/index.js',
    },
    plugins: [typescript()]
  },
  {
    input: 'src/context.ts',
    external: [
      'lit',
      '@lit/context',
      'zustand/vanilla'
    ],
    output: {
		  file: 'dist/context.js',
    },
    plugins: [typescript()]
  }
]);
