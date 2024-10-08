import "./window"
import { $, $s } from "@repo/utils"
import { fixSearch } from "./search"

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
  "div>div[data-tracking-opt-in-overlay]",
  "footer",
]

removeBloatware()
/**
 * Removes all unnecessary elements,
 * declared in "removeListSingle" list
 */
function removeBloatware() {
  removeListSingle.forEach(q => $s(q)?.remove())
  massRemove.forEach(q => $(q).forEach(e => e?.remove()))
  toResize.forEach(q => $s<HTMLElement>(q)?.setAttribute("style", "width:100%;margin:0"))
}

removeExcessiveBodyClassNames()
/**
 * This only leaves the necessary style and
 * restores the ability to scroll the page,
 * after removing cookie popup
 */
function removeExcessiveBodyClassNames() {
  for (const c of document.body.classList) {
    if (c.includes("skin-fandom")) continue
    document.body.classList.remove(c)
  }
}

function removeExcessiveHtmlAttrs() {
  document.documentElement.removeAttribute("class")
  document.documentElement.removeAttribute("dir")
  document.documentElement.removeAttribute("style")
}

new MutationObserver(mutationsList => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      removeBloatware()
      fixSearch()
    }
    if (mutation.type === "attributes") {
      removeExcessiveBodyClassNames()
      removeExcessiveHtmlAttrs()
    }
  }
}).observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeOldValue: true,
})
