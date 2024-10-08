import { $ } from "bun"
import { createManifest } from "./manifest"
import { findEntry } from "./entry"
import { parseFlags } from "./flags"
import { startServer } from "./web"
import * as Bun from "bun"
import * as ESBuild from "esbuild"
import deleteLinePlugin from "./plugins/delete"
import Icons from "unplugin-icons/esbuild"

const {
  entrypoint,
  manifestSrc = "manifest.json",
  outfile = "dist/script.user.js",
  noBuild,
  watch,
  web,
  webPort,
  webOpen,
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
    format: "esm",
    loader: {
      ".svg": "text",
    },
    plugins: [deleteLinePlugin, Icons({ compiler: "raw" })],
  }

  if (watch) {
    const ctx = await ESBuild.context({ ...buildOptions, logLevel: "info", outfile, write: true })
    ctx.watch()

    if (web) {
      startServer(webPort, manifestSrc)
      if (webOpen) await $`xdg-open http://localhost:${webPort}/${outfile}`
    }
  } else if (web) throw Error("Serving files is only avaiable in watch mode")

  const { outputFiles = [] } = await ESBuild.build(buildOptions)

  if (outputFiles.length !== 1) throw Error(`Wrong number of output files for: ${entrypoint} (${outputFiles.length})`)
  if (!outputFiles[0].contents) throw Error(`No output file found for: ${entrypoint} (${outputFiles})`)

  contents = Buffer.from(outputFiles[0].contents).toString()
}

if (!watch) {
  const manifest = await createManifest(manifestSrc)
  await Bun.write(outfile, manifest + contents)
}
