import * as fs from "node:fs/promises"
import { createManifest } from "./manifest"

export function startServer(port: number, manifestSrc: string) {
  const server = Bun.serve({
    port,
    hostname: "localhost",
    async fetch(req: Request) {
      const pth = new URL(req.url).pathname.replace("/", "")

      if (!pth.startsWith("dist/")) {
        return new Response("-1", { status: 403 })
      }

      if (!(await fs.exists(pth))) {
        return new Response("-1", { status: 404 })
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
