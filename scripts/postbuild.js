import fs from 'fs';
import path from 'path';


const src = path.join(import.meta.dirname, '../src/index.d.ts');
const dest = path.join(import.meta.dirname, '../dist/index.d.ts');

fs.copyFileSync(src, dest);
