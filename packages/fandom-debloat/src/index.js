const d = document

function $(query, all = false) {
  if (all) return d.querySelectorAll(query)
  return d.querySelector(query)
}

const toResize = [".fandom-community-header__background", ".main-container"]
const massRemove = ["iframe", "link[as='script']", "meta", "script", "style:not([type='text/css'])"]
const removeListSingle = [
  ".bottom-ads-container",
  ".fandom-sticky-header",
  ".global-navigation",
  ".global-registration-buttons",
  ".notifications-placeholder",
  ".page__right-rail",
  ".page-side-tools",
  ".right-rail-wrapper",
  ".top-ads-container",
  ".unified-search__layout__right-rail",
  "#age-gate",
  "#featured-video__player-container",
  "#global-explore-navigation",
  "#p-views",
  "#WikiaBar",
  "body > svg + *",
  "div>div[data-tracking-opt-in-overlay]",
  "footer",
]

removeBloatware()
/**
 * Removes all unnecessary elements,
 * declared in "removeListSingle" list
 */
function removeBloatware() {
  removeListSingle.forEach(q => $(q)?.remove())
  massRemove.forEach(q => $(q, true).forEach(e => e?.remove()))
  for (const q of toResize) {
    const el = $(q)
    if (!el) continue

    el.style.width = "100%"
    el.style.margin = 0
  }
}

removeExcessiveBodyClassNames()
/**
 * This only leaves the necessary style and
 * restores the ability to scroll the page,
 * after removing cookie popup
 */
function removeExcessiveBodyClassNames() {
  for (const c of d.body.classList) {
    if (c.includes("skin-fandom")) continue
    d.body.classList.remove(c)
  }
}

function removeExcessiveHtmlAttrs() {
  d.documentElement.removeAttribute("class")
  d.documentElement.removeAttribute("dir")
  d.documentElement.removeAttribute("style")
}

new MutationObserver(mutationsList => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") removeBloatware()
    if (mutation.type === "attributes") {
      removeExcessiveBodyClassNames()
      removeExcessiveHtmlAttrs()
    }
  }
}).observe(d.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeOldValue: true,
})

window.ads = undefined
