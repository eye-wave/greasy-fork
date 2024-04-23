import * as Bun from "bun"

export type CLIOptions = {
  entrypoint?: string
  manifestSrc?: string
  outfile?: string
}

export function parseFlags(args: string[]) {
  const options: CLIOptions = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case "--help":
      case "-h":
        {
          console.log("Usage:")
        }
        break

      case "--version":
      case "-V":
        {
          Bun.file("package.json")
            .json()
            .then(pkg => pkg.version)
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
