import { $s } from "@repo/utils"

export function waitFor<T extends Element>(selector: string, timeout = 10_000) {
  return new Promise<T>((resolve, reject) => {
    const observer = new MutationObserver(mutationList => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList" || mutation.type === "attributes") {
          const element = $s(selector)
          if (element) resolve(element as T)
        }
      }
    })

    observer.observe(document.documentElement, {
      subtree: true,
      attributes: true,
      childList: true,
    })

    const element = $s(selector)
    if (element) {
      observer.disconnect()
      resolve(element as T)
      return
    }

    setTimeout(() => {
      observer.disconnect()
      reject(`Timeout reached, element '${selector}' could not be found`)
    }, timeout)
  })
}
