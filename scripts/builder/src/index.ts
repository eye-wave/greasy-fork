import * as Bun from "bun"
import * as ESBuild from "esbuild"
import { createManifest } from "./manifest"
import { findEntry } from "./entry"
import { parseFlags } from "./flags"
import { startServer } from "./web"

const {
  entrypoint,
  manifestSrc = "src/manifest.json",
  outfile = "dist/script.user.js",
  noBuild,
  watch,
  web,
  webPort,
} = await parseFlags(process.argv)

let contents: string

if (noBuild) {
  if (!entrypoint) throw Error("Entry point is required")

  contents = await Bun.file(entrypoint).text()
} else {
  const buildOptions: ESBuild.BuildOptions = {
    entryPoints: [entrypoint ?? (await findEntry())],
    bundle: true,
    minify: false,
    write: false,
    loader: {
      ".svg": "text",
    },
  }

  if (watch) {
    const ctx = await ESBuild.context({ ...buildOptions })
    await ctx.watch()

    if (web) {
      const server = startServer(webPort)
    }
  } else if (web) throw Error("Serving files is only avaiable in watch mode")

  const { outputFiles = [] } = await ESBuild.build(buildOptions)

  if (outputFiles.length !== 1) throw Error(`Wrong number of output files for: ${entrypoint} (${outputFiles.length})`)
  if (!outputFiles[0].contents) throw Error(`No output file found for: ${entrypoint} (${outputFiles})`)

  contents = Buffer.from(outputFiles[0].contents).toString()
}

const manifest = await createManifest(manifestSrc)
await Bun.write(outfile, manifest + contents)
