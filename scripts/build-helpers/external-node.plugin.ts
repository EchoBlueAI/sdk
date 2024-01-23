import { PluginWithOptions } from './plugin.types'

const NON_NODE_MODULE_RE = /^[^./]|^\.[^./]|^\.\.[^/]/

export type ExternalNodePluginOptions = {
  patterns?: string[]
  skipNodeModulesBundle?: boolean
  disabled?: boolean
}

export const externalNodePlugin: PluginWithOptions<
  ExternalNodePluginOptions
> = ({ patterns, skipNodeModulesBundle, disabled }) => ({
  name: 'external',
  setup(build) {
    if (disabled) return
    if (skipNodeModulesBundle) {
      build.onResolve({ filter: NON_NODE_MODULE_RE }, (args) => ({
        path: args.path,
        external: true,
      }))
    }
    if (!patterns || patterns.length === 0) return
    build.onResolve({ filter: /.*/ }, (args) => {
      const external = patterns.some((p: string | RegExp) => {
        if (p instanceof RegExp) {
          return p.test(args.path)
        }
        return args.path === p
      })
      if (external) {
        return { path: args.path, external }
      }
    })
  },
})
