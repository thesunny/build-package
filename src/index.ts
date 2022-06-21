import { rollup } from "rollup"
import * as utils from "@thesunny/script-utils"
import { stringify } from "@thesunny/script-utils"
import { createPlugins } from "./plugins"
import { onwarn } from "./onwarn"
import pluginDTS from "rollup-plugin-dts"
import rimraf from "rimraf"
import deleteEmpty from "delete-empty"
import path from "path"

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
  // for (const s of src) {
  //   straightPath(s, "src")
  // }
  straightPath(dest, "dest")
  straightPath

  utils.ensureEmpty(dest)

  // for (const s of src) {
  //   utils.ensureFileExists(s)
  // }

  /**
   * Generate CJS and Types plugins
   */

  utils.task("Generate CJS and Types plugins")
  const cjsAndTypesPlugins = createPlugins({
    tsconfig: "tsconfig.rollup.json",
    declaration: true,
  })
  utils.pass("Done")

  /**
   * Generate CJS and Types bundle
   */

  utils.task("Generate CJS and Types bundle")
  const bundle = await rollup({
    input: src,
    plugins: cjsAndTypesPlugins,
    onwarn,
    external,
  })
  utils.pass("Done")

  /**
   * Write CommonJS Files
   */
  const cjsDir = `${dest}/cjs`
  utils.task(`Write CJS Files to ${stringify(cjsDir)}`)
  await bundle.write({
    dir: cjsDir,
    format: "cjs",
    sourcemap,
  })
  utils.pass("Done")

  /**
   * Generate ESM plugins
   */

  utils.task("Generate ESM plugins")
  const esmPlugins = createPlugins({
    tsconfig: "tsconfig.rollup.json",
    declaration: false,
  })
  utils.pass("Done")

  /**
   * Generate ESM bundle
   */

  utils.task("Generate CJS and Types bundle")
  const esmBundle = await rollup({
    input: src,
    plugins: esmPlugins,
    onwarn,
    external,
  })
  utils.pass("Done")

  /**
   * Write ESM Files
   */
  const esmDir = `${dest}/esm`
  utils.task(`Write ESM files to ${stringify(esmDir)}`)
  await esmBundle.write({
    dir: esmDir,
    format: "esm",
    sourcemap,
  })
  utils.pass("Done")

  /**
   * Generate d.ts bundle
   */
  utils.task("Generate Types bundle")
  const dtsBundle = await rollup({
    input: src.map((path) => `${dest}/cjs/${path.replace(".ts", ".d.ts")}`),
    plugins: [pluginDTS()],
  })
  utils.pass("Done")

  /**
   * Write d.ts Files
   */

  const typesDir = `${dest}/.types`
  utils.task(`Write Types files to ${stringify(typesDir)}`)
  await dtsBundle.write({
    dir: typesDir,
    format: "es",
  })
  utils.pass("Done")

  /**
   * Remove d.ts files from cjs directory
   */
  utils.task("Remove d.ts files from cjs directory")
  rimraf.sync(`${dest}/cjs/**/*.d.ts`)
  utils.pass("Done")

  /**
   * Remove empty directories
   */
  utils.task("Remove empty directories in cjs directory")

  /**
   * `path.resolve` to fix a bug
   * https://github.com/jonschlinkert/delete-empty/issues/14
   */
  const deletedDirs = await deleteEmpty(path.resolve(`${dest}/cjs`))
  utils.pass(`Done. Removed ${deletedDirs.length} empty dirs.`)
}
