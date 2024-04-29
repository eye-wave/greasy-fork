import { describe, it, expect } from "bun:test"
import { embed, parse, swapVarInPlace, createManifest, type ManifestLike } from "./parser"
import * as path from "node:path"
import { userInfo } from "node:os"

describe("parse function test", () => {
  it("parses json example into ManifestLike type", async () => {
    const example = {
      name: "John",
      list: ["🍎", "🍍", "🌱", "🥩"],
    }

    const expected: ManifestLike = {
      name: ["John"],
      list: ["🍎", "🍍", "🌱", "🥩"],
    }

    expect(await parse(example, __filename)).toEqual(expected)
  })

  it("parses json example extended with other manifest into ManifestLike type", async () => {
    const example = {
      place_of_origin: "🇨🇭",
      extends: ["./extension.test.json"],
    }

    const expected: ManifestLike = {
      category: ["fun"],
      item: ["📖"],
      title: ["survival guide"],
      place_of_origin: ["🇨🇭"],
    }

    expect(await parse(example, __filename)).toEqual(expected)
  })
})

describe("embed function test", () => {
  it("embeds ManifestLike into a beautiful string", () => {
    const example: ManifestLike = {
      name: ["John"],
      list: ["🍎", "🍍", "🌱", "🥩"],
    }

    const expected = `// ==UserScript==
// @name    John
// @list    🍎
// @list    🍍
// @list    🌱
// @list    🥩
// ==/UserScript==
`

    expect(embed(example)).toBe(expected)
  })
})

describe("swapVarInPlace function test", () => {
  it("swaps variable declarations with values", () => {
    const dir = path.basename(process.cwd())
    const username = userInfo().username

    const packageJson = {
      version: "1.2.3",
      author: {
        name: username,
      },
    }

    const example: ManifestLike = {
      version: ["${package.version}"],
      author: ["${package.author.name}"],
      icon: ["https://github.com/repo/.../${dirname}/icon.svg"],
    }

    const expected: ManifestLike = {
      version: ["1.2.3"],
      author: [username],
      icon: [`https://github.com/repo/.../${dir}/icon.svg`],
    }

    expect(swapVarInPlace(example, packageJson)).toEqual(expected)
  })
})

describe("All at once", async () => {
  const example = "src/manifest/extension2.test.json"
  const expected = `// ==UserScript==
// @grant          none
// @version        0.4.0
// @author         eye-wave
// @icon           https://awesomeimagehosting.com/builder/icon.svg
// @license        GPL-3.0+
// @name           My awesome userscript
// @namespace      some namespace
// @match          https://youtube.com/*
// @description    My awesome userscript description
// ==/UserScript==
`
  expect(await createManifest(example)).toBe(expected)
})
