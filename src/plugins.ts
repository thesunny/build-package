import { Plugin } from "rollup"
import pluginReplace from "@rollup/plugin-replace"
import pluginNodeResolve from "@rollup/plugin-node-resolve"
import pluginJson from "@rollup/plugin-json"
import pluginCommonjs from "@rollup/plugin-commonjs"
import pluginTypescript2 from "rollup-plugin-typescript2"
import { terser as pluginTerser } from "rollup-plugin-terser"
import mapKeys from "just-map-keys"

type PluginOptions = {
  tsconfig: string
  env?: Record<string, string>
  replace?: Record<string, string>
  terser?: boolean
}

export function createPlugins({
  tsconfig,
  env = {},
  replace = {},
  terser = true,
}: PluginOptions) {
  if (tsconfig.startsWith("/"))
    throw new Error(`tsconfig should not start with a /`)

  const plugins: Array<Plugin | undefined> = [
    pluginReplace({
      ...mapKeys(env, (key) => `process.env.${key}`),
      ...replace,
      preventAssignment: true,
    }),
    pluginNodeResolve({
      preferBuiltins: true,
    }),
    pluginCommonjs(),
    pluginJson(),
    pluginTypescript2({
      tsconfig: "tsconfig.rollup.json",
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
        },
      },
    }),
    terser ? pluginTerser() : undefined,
  ]
  return plugins
}
