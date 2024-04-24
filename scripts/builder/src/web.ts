import * as fs from "node:fs/promises"

export function startServer(port: number) {
  const server = Bun.serve({
    hostname: "localhost",
    port,
    async fetch(req: Request) {
      const pth = new URL(req.url).pathname.replace("/", "")

      if (!pth.startsWith("dist/")) {
        return new Response("-1", { status: 403 })
      }

      if (!(await fs.exists(pth))) {
        return new Response("-1", { status: 404 })
      }

      return new Response(Bun.file(pth))
    },
  })

  return server
}
