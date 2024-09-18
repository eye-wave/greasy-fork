import { $s } from "@repo/utils"

export function fixSearch() {
  const search = $s<HTMLAnchorElement>("a[title='Search']")
  
  if ( search ) {
    search.removeAttribute("data-tracking")
    search.onclick =function() {
      window.location.pathname = "/wiki/Special:Search"
    }
  }
}
