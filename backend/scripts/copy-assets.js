import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcSchema = path.join(__dirname, '..', 'src', 'db', 'schema.sql');
const destDir = path.join(__dirname, '..', 'dist', 'db');
const destSchema = path.join(destDir, 'schema.sql');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(srcSchema, destSchema);
console.log('[Build] Copied schema.sql to dist/db/schema.sql');
