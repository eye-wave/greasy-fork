import * as fs from "node:fs/promises"
import * as path from "node:path"

export async function findEntry() {
  const commonNames = ["index", "app", "main"]
  const extensions = [".ts", ".js", ".cjs", ".mjs"]

  for (const name of commonNames) {
    for (const extension of extensions) {
      const searchPath = path.join("./src", name + extension)
      if (await fs.exists(searchPath)) return searchPath
    }
  }

  throw Error(`Could not find entry in: "${path.resolve(".")}"`)
}
