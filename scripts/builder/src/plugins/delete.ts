import type { Plugin } from "esbuild"
import * as Bun from "bun"

export default {
  name: "esbuild-delete-line-plugin",
  setup(build) {
    build.onLoad({ filter: /\.(c|m)??(t|j)s$/ }, async args => {
      const file = await Bun.file(args.path).text()

      const isTypescript = args.path.endsWith(".ts")

      return {
        contents: file.replace(/\/\* DELETE \*\/.+$/gm, ""),
        loader: isTypescript ? "ts" : "js",
      }
    })
  },
} satisfies Plugin
