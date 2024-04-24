import * as Bun from "bun"

const packageJson = await Bun.file("package.json").json()

export function createManifest(data: Record<string, string>) {
  const maxLengthKey = Object.keys(data).reduce((max, key) => (max > key.length ? max : key.length), 0)
  const userscriptManifest: string[] = []

  for (const [key, value] of Object.entries(data)) {
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
  userscriptManifest.push("// ==UserScript==")

  return `${userscriptManifest.join("\n")}\n`
}
