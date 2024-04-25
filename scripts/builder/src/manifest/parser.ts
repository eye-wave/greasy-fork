import * as Bun from "bun"
import * as path from "node:path"

const typeError = (field: string, value: string, type: string) => `"${field}" value: '${value}' is not an ${type}`

export type Manifest = Record<string, string[]> & { extends?: string[] }
export type ManifestLike = Record<string, string[]>

export async function parse(data: Record<string, unknown>, src: string): Promise<ManifestLike> {
  const parsed: ManifestLike = {}

  // if there is a "extends" parameter import extended manifests
  // and use their values in input data
  if (data.extends) {
    if (!Array.isArray(data.extends)) throw TypeError(typeError("extends", `${data.extends}`, "array"))

    for (const extension of data.extends) {
      const extensionPath = path.join(path.dirname(src), extension)

      try {
        const extensionData = await Bun.file(extensionPath).json()
        const keys = Object.keys(extensionData)

        for (const extensionKey of keys) {
          // No support for nested extended manifests
          if (extensionKey === "extends") continue
          if (extensionKey in data) continue

          // TODO refactor this duplicated logic
          const value = extensionData[extensionKey]
          const isArray = Array.isArray(value)
          if (typeof value !== "string" && !isArray) throw TypeError(typeError(extensionKey, `${value}`, "string"))

          // values can be arrays too
          // this ensures that values is always an array
          parsed[extensionKey] = isArray ? value : [value]
        }
      } catch {
        console.warn(`Failed to load manifest extension from: '${extensionPath}' (${extension})`)
      }
    }
  }

  const valuesToSkip = new Set(["extends", "$schema"])

  // loop over key value pairs in input json
  for (const [key, value] of Object.entries(data)) {
    if (valuesToSkip.has(key)) continue
    if (typeof value === "undefined") {
      console.warn(`Skipping undefined value at: '${key}'`)
      continue
    }

    const isArray = Array.isArray(value)
    if (typeof value !== "string" && !isArray) throw TypeError(typeError(key, `${value}`, "string"))

    // values can be arrays too
    // this ensures that values is always an array
    parsed[key] = isArray ? value : [value]
  }

  return parsed
}

// biome-ignore lint: lint/suspicious/noExplicitAny
export function swapVarInPlace(data: ManifestLike, packageJson: any): ManifestLike {
  const globals: Record<string, string> = {
    dirname: path.basename(process.cwd()),
  }

  for (const [key, values] of Object.entries(data)) {
    const swapped: Array<string> = []

    for (const value of values) {
      const variables = Array.from(value.matchAll(/\${([^}]+)}/g))
      let swap = value

      for (const [match, variable] of variables) {
        if (variable.startsWith("package")) {
          let scope = packageJson
          const levels = variable.split(".").slice(1)

          for (const level of levels) {
            if (!(level in scope)) throw Error(`Could not find '${variable}' in package.json`)
            scope = scope[level]
          }

          if (typeof scope !== "string")
            throw Error(`value '${variable}' is not a string, found: ${JSON.stringify(scope, null, 2)}:${typeof scope}`)
          swap = swap.replace(match, scope)
          continue
        }

        if (variable.includes(".")) {
          console.warn(`Nested value found in: '${variable}'. Nested values are only avaiable for package`)
          continue
        }

        if (!(variable in globals)) {
          console.warn(`No value '${variable}' found in: ${JSON.stringify(globals, null, 2)}`)
          continue
        }

        swap = swap.replace(match, globals[variable])
      }

      swapped.push(swap)
    }

    data[key] = swapped
  }

  return data
}

// Passing
export function embed(records: ManifestLike): string {
  const userscriptManifest: string[] = []
  const maxLengthKey = Object.keys(records).reduce((max, key) => (max > key.length ? max : key.length), 0)

  // loop over all values for a key
  for (const [key, values] of Object.entries(records)) {
    for (const value of values) {
      const spaces = maxLengthKey + 4 - key.length
      userscriptManifest.push(`// @${key}${" ".repeat(spaces)}${value}`)
    }
  }

  userscriptManifest.unshift("// ==UserScript==")
  userscriptManifest.push("// ==/UserScript==")

  return `${userscriptManifest.join("\n")}\n`
}

export async function createManifest(src: string) {
  const packageJson = await Bun.file("package.json")
    .json()
    .catch(() => ({}))

  return Bun.file(src)
    .json()
    .then(data => parse(data, src))
    .then(data => swapVarInPlace(data, packageJson))
    .then(embed)
}
