import { build } from ".."
import * as utils from "@thesunny/script-utils"
import { logger } from "@thesunny/script-utils"

describe("index", () => {
  const jestConsole = console

  beforeEach(() => {
    global.console = require("console")
  })

  afterEach(() => {
    global.console = jestConsole
  })

  beforeAll(async () => {
    await logger.silence(async () => {
      await utils.emptyDir(".samples")
    })
  })

  it("should fail with a bad src", async () => {
    await logger.silence(async () => {
      await expect(
        async () =>
          await build({
            title: "Sample One",
            src: ["./samples/simple/index.ts"],
            dest: ".samples/simple",
          })
      ).rejects.toThrow("should not start with")
    })
  })

  it("should fail with a bad src", async () => {
    await expect(
      async () =>
        await build({
          title: "Sample One",
          src: ["/samples/simple/index.ts"],
          dest: ".samples/simple",
        })
    ).rejects.toThrow("should not start with")
  })

  it("should build a single file", async () => {
    await build({
      title: "Single",
      src: ["samples/single/index.ts"],
      dest: ".samples/single",
    })
  })

  it("should build multiple files together", async () => {
    await build({
      title: "Multiple",
      src: ["samples/multiple/index.ts"],
      dest: ".samples/multiple",
    })
  })

  it("should build multiple files in pieces", async () => {
    await build({
      title: "Multiple Separated",
      src: ["samples/multiple/index.ts", "samples/multiple/add.ts"],
      dest: ".samples/multiple-separated",
    })
  })

  /**
   * WORKING ON THIS!:
   *
   * Currently, I am working on getting TypeScript to output into a nice set of
   * files in the correct directory.
   *
   * I have it compiling down to the few files I want, but I don't have it
   * moved in the right position yet.
   *
   * https://medium.com/@martin_hotell/typescript-library-tips-rollup-your-types-995153cc81c7
   *
   * There is also an option called `declarationDir` which should separate the
   * .d.ts files into a separate directory, but it doesn't seem to be working
   * when I set it in rollup's plugins configuration. It's possible it's a
   * caching issue though.
   *
   * I just figured out I can use a Record<string, string> for the src to
   * control where the files end up. This is really nice.
   *
   * We can try and use the same mapping to create the .d.ts files.
   */

  it.only("should build nested files in pieces", async () => {
    await build({
      title: "Nested",
      // src: ["samples/nested/index.ts", "samples/nested/math/index.ts"],
      src: {
        index: "samples/nested/index.ts",
        "math/index": "samples/nested/math/index.ts",
      },
      dest: ".samples/nested",
    })
  })
})
