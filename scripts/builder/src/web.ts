import * as fs from "node:fs/promises"
import { createManifest } from "./manifest"

export function startServer(port: number, manifestSrc: string) {
  const server = Bun.serve({
    port,
    hostname: "localhost",
    async fetch(req: Request) {
      const pth = new URL(req.url).pathname.replace("/", "")

      if (!pth.startsWith("dist/")) {
        throw Error("All requests besides /dist are forbidden")
      }

      if (!(await fs.exists(pth)) || !(await fs.stat(pth)).isFile()) {
        throw Error(`404 Couldn't find file: "${pth}"`)
      }

      const manifest = await createManifest(manifestSrc)
      return new Response(`${manifest}\n\n${await Bun.file(pth).text()}`, {
        headers: {
          "access-control-allow-origin": "*",
          "cache-control": "max-age=0",
        },
      })
    },
  })

  return server
}
