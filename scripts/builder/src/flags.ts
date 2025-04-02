import * as Bun from "bun"
import * as path from "node:path"

export type CLIOptions = {
  entrypoint?: string
  manifestSrc?: string
  outfile?: string
  noBuild: boolean
  webPort: number
  watch: boolean
  web: boolean
  webOpen: boolean
}

const usage = `Usage: builder [OPTIONS] -i <INPUT> -o <OUTPUT> -m <MANIFEST>

Options:
  -i, --input <INPUT>        entrypoint path
  -o, --output <OUTPUT>      build output path
  -m, --manifest <MANIFEST>  manifest file with required metadata

  -d, --dev                  run in watch mode with a webserver

  -w, --watch                watch for changes

  --web                      serve file on a web server
  --open                     open server url in a web browser
  -p --port                  port number of the web server

  --no-build                 don't bundle the code, just embed the manifest.
                             it copies unmodified input with manifest at the top
                             into specified output

  -h, --help                 Display this help message
  -V, --version              Display current version
`

export async function parseFlags(args: string[]) {
  const options: CLIOptions = { noBuild: false, webPort: 3000, watch: false, web: false, webOpen: false }

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

      case "--port":
      case "-p":
        {
          options.outfile = args[++i]
        }
        break

      case "--web":
        options.web = true
        break

      case "--open":
        options.webOpen = true
        break

      case "--watch":
      case "-w":
        options.watch = true
        break

      case "--dev":
      case "-d":
        options.web = true
        options.watch = true
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
