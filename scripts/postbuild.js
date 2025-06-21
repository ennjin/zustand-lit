import fs from 'fs';
import path from 'path';


const declarations = [
  'index',
  'context'
];

for (const file of declarations) {
  const src = path.join(import.meta.dirname, `../src/${ file }.d.ts`);
  const dest = path.join(import.meta.dirname, `../dist/${ file }.d.ts`);

  fs.copyFileSync(src, dest);
}
