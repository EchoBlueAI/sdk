import { build, BuildOptions } from 'esbuild'
import { execa as exec } from 'execa'
import { externalNodePlugin } from './build-helpers/external-node.plugin'
import { transformPathsPlugin } from './build-helpers/transform-paths.plugin'
import getCommandLineArgs from 'command-line-args'

const args = getCommandLineArgs([
  { name: 'in', type: String, defaultValue: false },
  { name: 'out', type: String, defaultValue: false },
  { name: 'types', type: String, defaultValue: false },
  { name: 'types-only', type: Boolean, defaultValue: false },
])

const prefix = '\x1b[2m>>\x1b[0m'
const suffix = '\x1b[2m<<\x1b[0m'

const log = (message: string, path?: string) =>
  console.log(prefix, message, suffix, `(\x1b[2m${path}\x1b[0m)`)

const formats = ['esm', 'cjs'] as const

if (!args.in) {
  throw new Error('No input (directory) specified. (--in)')
}

if (!args.out) {
  throw new Error('No output (directory) specified. (--out)')
}

if (!args.types) {
  throw new Error('No types output (directory) specified. (--types)')
}

;(async () => {
  if (args['types-only']) {
    const start = Date.now()
    console.log('Building type definitions...')
    try {
      const cmd = `tsc --project tsconfig.json --rootDir ${args.in} --outDir ${args.types}`
      const cmdPaths = `tscpaths -p tsconfig.json -s ${args.in} -o ${args.types}`

      await exec('npx', cmd.split(' '))
      await exec('npx', cmdPaths.split(' '))

      log(
        `Built types in ${Math.floor(Date.now() - start)}ms.`,
        `${args.types}/***`,
      )
    } catch (e) {
      console.error(e)
      console.error('Build failed.')
      process.exit(1)
    } finally {
      console.error('Build complete.')
      process.exit(0)
    }
  } else {
    const packageJSON = await import(
      `file://${process.cwd()}/package.json`
    ).then((mod) => mod.default)
    const buildOptions = (options: Partial<BuildOptions>): BuildOptions => ({
      bundle: true,
      jsx: 'automatic',
      sourcemap: true,
      ...options,
      external: Object.keys(packageJSON.peerDependencies ?? {}).concat(
        Object.keys(packageJSON.dependencies ?? {}),
      ),
      plugins: [...(options.plugins ?? [])],
    })

    const start = Date.now()

    console.log('Building SDK...')
    await Promise.all(
      formats
        .map(async (format) => {
          await build(
            buildOptions({
              format: format,
              entryPoints: [`${args.in}/index.ts`],
              outdir: `${args.out}/${format}`,
              target: format === 'esm' ? 'node16' : 'node14',
              platform: format === 'esm' ? 'neutral' : 'node',
              plugins:
                format === 'cjs'
                  ? [externalNodePlugin({ skipNodeModulesBundle: true })]
                  : [],
            }),
          )

          log(
            `(${format.toUpperCase()}) Built in ${Math.floor(
              Date.now() - start,
            )}ms.`,
            `dist/${format}/`,
          )
        })
        .flat(),
    )
      .then(() => console.log('Build complete.'))
      .catch(() => {
        console.error('Build failed.')
        process.exit(1)
      })
  }
})()
