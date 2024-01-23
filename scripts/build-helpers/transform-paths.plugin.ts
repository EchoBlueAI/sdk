import type { OnLoadResult } from 'esbuild'
import { dirname, relative, resolve } from 'path'
import { readFile } from 'node:fs/promises'
import { PluginWithOptions } from './plugin.types'

export type TransformPathsPluginOptions = {
  baseUrl: string
}

const getRelativePathToFile = (
  basePath: string,
  currentFilePath: string,
  resolvedFilePath: string,
) =>
  relative(
    dirname(currentFilePath),
    resolve(__dirname, basePath, resolvedFilePath),
  ).replace(/\\/g, '/')

export const transformPathsPlugin: PluginWithOptions<
  TransformPathsPluginOptions
> = ({ baseUrl }) => ({
  name: 'transform-paths',
  setup(build) {
    build.onLoad({ filter: /.*/ }, async (args): Promise<OnLoadResult> => {
      const { path } = args
      const resolvedPath = resolve(path)
      const contents = await readFile(resolvedPath, 'utf8')

      const transformedContents = contents.replace(
        /['"]src\/(.+)['"]/g,
        (match, $1) =>
          `"./${getRelativePathToFile(
            baseUrl,
            resolve(__dirname, resolvedPath),
            resolve(__dirname, '..', '..', baseUrl, $1),
          )}"`,
      )

      return {
        contents: transformedContents,
        loader: path.split('.')[1] as 'ts' | 'tsx',
      }
    })
  },
})
