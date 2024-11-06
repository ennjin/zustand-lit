import { esbuildPlugin } from '@web/dev-server-esbuild';


export default {
  nodeResolve: true,
  files: [
    './test/**/*.spec.ts'
  ],
  plugins: [
    esbuildPlugin({
      ts: true,
      tsconfig: './tsconfig.test.json',
    })
  ],
};
