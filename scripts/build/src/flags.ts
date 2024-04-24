import * as Bun from "bun"
import * as path from "node:path"

export type CLIOptions = {
  entrypoint?: string
  manifestSrc?: string
  outfile?: string
  noBuild: boolean
}

const usage = `Usage: builder [OPTIONS] -i <INPUT> -o <OUTPUT> -m <MANIFEST>

Options:
  -i, --input <INPUT>        entrypoint path
  -o, --output <OUTPUT>      build output path
  -m, --manifest <MANIFEST>  manifest file with required metadata

  --no-build                 don't bundle the code, just embed the manifest.
                             it copies unmodified input with manifest at the top
                             into specified output

  -h, --help                 Display this help message
  -V, --version              Display current version
`

export async function parseFlags(args: string[]) {
  const options: CLIOptions = { noBuild: false }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case "--help":
      case "-h":
        {
          console.log(usage)
          process.exit(0)
        }
        break

      case "--version":
      case "-V":
        {
          await Bun.file(path.join(__dirname, "..", "package.json"))
            .json()
            .then(pkg => pkg.version)
            .then(console.log)

          process.exit(0)
        }
        break

      case "--input":
      case "-i":
        {
          options.entrypoint = args[++i]
        }
        break

      case "--output":
      case "-o":
        {
          options.outfile = args[++i]
        }
        break

      case "--no-build":
        options.noBuild = true
        break

      case "--manifest":
      case "-m":
        {
          options.manifestSrc = args[++i]
        }
        break
    }
  }

  return options
}
