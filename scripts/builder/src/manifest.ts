import * as Bun from "bun"
import * as path from "node:path"

const packageJson = await Bun.file("package.json").json()

export type Manifest = Record<string, string> & { extends?: string[] }

export async function createManifest(src: string) {
  const data: Manifest = await Bun.file(src).json()
  const maxLengthKey = Object.keys(data).reduce((max, key) => (max > key.length ? max : key.length), 0)
  const userscriptManifest: string[] = []
  const typeError = (field: string, value: string, type: string) => `"${field}" value: '${value}' is not an ${type}`

  if (data.extends) {
    if (!Array.isArray(data.extends)) throw TypeError(typeError("extends", data.extends, "array"))

    for (const extension of data.extends) {
      const extensionPath = path.join(path.dirname(src), extension)
      try {
        const extensionData = await Bun.file(extensionPath).json()
        const keys = Object.keys(extensionData)

        for (const extensionKey of keys) {
          if (extensionKey in data) continue
          data[extensionKey] = extensionData[extensionKey]
        }
      } catch {
        console.warn(`Failed to load manifest extension from: '${extensionPath}' (${extension})`)
      }
    }

    data.extends = undefined
  }

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "undefined") continue
    if (typeof value !== "string") throw TypeError(typeError(key, `${value}`, "string"))

    const matches = value.matchAll(/(?:(?<!\\)\$package)((?:\.[\w\d]+){1,})/g)
    let modifiedValue = value

    for (const [match, group] of matches) {
      const propTree = group.split(".").filter(p => p)
      let scope = packageJson

      for (let i = 0; i < propTree.length - 1; i++) {
        scope = scope[propTree[i]]
      }

      const newValue = scope?.[propTree[propTree.length - 1]]
      modifiedValue = modifiedValue.replace(match, newValue)
    }

    const spaces = maxLengthKey + 4 - key.length
    userscriptManifest.push(`// @${key}${" ".repeat(spaces)}${modifiedValue}`)
  }

  userscriptManifest.unshift("// ==UserScript==")
  userscriptManifest.push("// ==/UserScript==")

  return `${userscriptManifest.join("\n")}\n`
}
