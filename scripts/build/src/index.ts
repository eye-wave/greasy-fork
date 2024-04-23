import * as Bun from "bun"
import * as ESBuild from "esbuild"
import { createManifest } from "./manifest"
import { findEntry } from "./entry"
import { parseFlags } from "./flags"

const { entrypoint, manifestSrc = "src/manifest.json", outfile = "dist/script.user.js" } = parseFlags(process.argv)

const { outputFiles } = await ESBuild.build({
  entryPoints: [entrypoint ?? (await findEntry())],
  minify: false,
  write: false,
  loader: {
    ".svg": "text",
  },
})

if (outputFiles.length !== 1) throw Error(`Wrong number of output files for: ${entrypoint} (${outputFiles.length})`)

const [buildArtifact] = outputFiles
const manifest = createManifest(await Bun.file(manifestSrc).json())
const file = Buffer.concat([Buffer.from(manifest), Buffer.from(buildArtifact.contents)])

await Bun.write(outfile, file)
