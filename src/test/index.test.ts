import { build } from ".."

describe("index", () => {
  it("should fail with a bad src", async () => {
    await expect(
      async () =>
        await build({
          title: "Sample One",
          src: ["./sample-one/index.ts"],
          dest: ".sample-one",
        })
    ).rejects.toThrow("should not start with")
  })

  it("should fail with a bad src", async () => {
    await expect(
      async () =>
        await build({
          title: "Sample One",
          src: ["sample-one/index.ts"],
          dest: ".sample-one",
        })
    ).rejects.toThrow("should not start with")
  })

  it.only("should pass", async () => {
    await build({
      title: "Sample One",
      src: ["sample-one/index.ts"],
      dest: ".sample-one",
    })
  })
})
