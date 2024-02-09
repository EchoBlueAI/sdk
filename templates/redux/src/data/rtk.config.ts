import type { ConfigFile } from '@rtk-query/codegen-openapi'
import { resolve } from 'node:path'

const BASE_DIR = resolve(__dirname)

const config = {
  exportName: 'getEchoBlueApi',
  apiImport: 'sampleApi',
  schemaFile: resolve(BASE_DIR, '../../../..', 'openapi.json'),
  apiFile: './empty.api.ts',
  outputFile: resolve(BASE_DIR, '../../src/index.ts'),
  hooks: true,
} satisfies ConfigFile

export default config
