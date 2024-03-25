// ==UserScript==
// @name        fandom.com - Remove bloatware
// @namespace   Violentmonkey Scripts
// @match       https://*.fandom.com/*
// @grant       none
// @version     1.0.0
// @author      eye-wave
// @license GPL 3.0
// @description removes unnecessary elements from fandom website, leaving only what's important
// ==/UserScript==

function $(query, all = false) {
  if (!all) return document.querySelectorAll(query)
  return document.querySelector(query)
}

const toResize = [".main-container", ".fandom-community-header__background"]
const massRemove = ["script", "iframe"]
const removeListSingle = [
  "footer",
  ".global-navigation",
  ".right-rail-wrapper",
  ".page__right-rail",
  ".page-side-tools",
  ".global-registration-buttons",
  ".fandom-sticky-header",
  ".notifications-placeholder",
  ".top-ads-container",
  ".bottom-ads-container",
  ".unified-search__layout__right-rail",
  "#p-views",
  "#WikiaBar",
  "#age-gate",
]

const sleep = async ms => new Promise(r => setTimeout(r, ms))

const observeDOMChanges = () => {
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        handleDOMChanges()
      }
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

function handleDOMChanges() {
  removeListSingle.forEach(q => $(q)?.remove())
  massRemove.forEach(q => $(q, true).forEach(e => e?.remove()))
  for (const q of toResize) {
    const el = $(q)
    if (!el) continue

    el.style.width = "100%"
    el.style.margin = 0
  }
}

observeDOMChanges()
