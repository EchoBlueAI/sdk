import 'scripts/util/logging'
import { execa as exec } from 'execa'

import glob from 'fast-glob'
import { cp, lstat, mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

const cwd = resolve(process.cwd(), 'generated/redux')

console.log('Cleaning up generated/redux/***...')
await lstat('generated/redux')
  .then(() => rm('generated/redux', { recursive: true }))
  .catch(() => mkdir('generated/redux', { recursive: true }))
console.log(' -- cleared generated/redux/***')
await mkdir('generated/redux/src', { recursive: true })
console.log(' -- created generated/redux/src')
await mkdir('generated/redux/dist', { recursive: true })
console.log(' -- created generated/redux/dist')

console.log('Copying redux project template...')
await glob('templates/redux/**/*').then((files) =>
  Promise.all(
    files.map((file) =>
      cp(file, file.replace('templates/redux', 'generated/redux')),
    ),
  ),
)

console.log('Installing dependencies...')
await exec('yarn', ['--no-immutable'], { cwd })

console.log('Generating redux files...')
await exec('npx', ['@rtk-query/codegen-openapi', './src/data/rtk.config.ts'], {
  cwd,
})

console.log('Compiling redux files...')
await exec(
  'tsx',
  [
    '../../scripts/build.ts',
    '--in',
    'src',
    '--out',
    'dist',
    '--types',
    'types',
  ],
  { cwd, stdout: 'inherit', stderr: 'inherit' },
)

console.log('Finalizing redux types...')
await exec(
  'tsx',
  [
    '../../scripts/build.ts',
    '--in',
    'src',
    '--out',
    'dist',
    '--types',
    'types',
    '--types-only',
  ],
  { cwd, stdout: 'inherit', stderr: 'inherit' },
)

console.log('Done!')
