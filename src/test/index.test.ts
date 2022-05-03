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
  // it("should fail with a bad src", async () => {
  //   await logger.silence(async () => {
  //     await expect(
  //       async () =>
  //         await build({
  //           title: "Sample One",
  //           src: ["./samples/simple/index.ts"],
  //           dest: ".samples/simple",
  //         })
  //     ).rejects.toThrow("should not start with")
  //   })
  // })

  // it("should fail with a bad src", async () => {
  //   await expect(
  //     async () =>
  //       await build({
  //         title: "Sample One",
  //         src: ["/samples/simple/index.ts"],
  //         dest: ".samples/simple",
  //       })
  //   ).rejects.toThrow("should not start with")
  // })

  it.only("should build a single file", async () => {
    await build({
      title: "Single",
      src: ["samples/single/index.ts"],
      dest: ".samples/single",
    })
  })

  it.only("should build multiple files together", async () => {
    await build({
      title: "Multiple",
      src: ["samples/multiple/index.ts"],
      dest: ".samples/multiple",
    })
  })
})
