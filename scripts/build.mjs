import { cpSync, mkdirSync, rmSync } from 'node:fs';

rmSync('public', { recursive: true, force: true });
mkdirSync('public', { recursive: true });
cpSync('index.html', 'public/index.html');
cpSync('app', 'public/app', { recursive: true });
console.log('Built static Studio into public/');
