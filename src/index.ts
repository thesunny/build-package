import { rollup } from "rollup"
import * as utils from "@thesunny/script-utils"
import { createPlugins } from "./plugins"
import { onwarn } from "./onwarn"

type BuildOptions = {
  title: string
  src: string[]
  dest: string
  external?: string[]
  cjs?: string
  esm?: string
  sourcemap?: boolean
}

/**
 * Ensure path
 */
function straightPath(path: string, name: string) {
  if (typeof path !== "string")
    throw new Error(
      `Expected path to be a string but is ${JSON.stringify(typeof path)}`
    )
  if (path.startsWith("./"))
    throw new Error(
      `${name} which is ${JSON.stringify(path)} should not start with a "./"`
    )
  if (path.startsWith("/"))
    throw new Error(
      `${name} which is ${JSON.stringify(path)} should not start with a "/"`
    )
  if (path.length === 0)
    throw new Error(`Expected path to be 1 or more characters but is ""`)
}

export async function build({
  title,
  src,
  dest,
  external = [],
  cjs,
  esm,
  sourcemap = false,
}: BuildOptions) {
  utils.title(`Build ${JSON.stringify(title)}`)
  for (const s of src) {
    straightPath(s, "src")
  }
  straightPath(dest, "dest")
  straightPath

  utils.heading("Ensure src files exist")
  for (const s of src) {
    utils.ensureFileExists(s)
  }

  utils.heading("Generate plugins")
  const plugins = createPlugins({ tsconfig: "tsconfig.ts-build.json" })

  const bundle = await rollup({
    input: src,
    plugins,
    onwarn,
    external,
  })

  /**
   * Write CommonJS Files
   */
  utils.heading("Write CommonJS files")
  await bundle.write({
    dir: `${dest}/cjs`,
    format: "cjs",
    sourcemap,
  })

  /**
   * Write ESM Files
   */
  utils.heading("Write CommonJS files")
  await bundle.write({
    dir: `${dest}/esm`,
    format: "esm",
    sourcemap,
  })
}
