import { Plugin } from 'esbuild'

export type PluginWithOptions<O> = (options: O) => Plugin
