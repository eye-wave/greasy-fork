
export function $<T extends Element>(query:string) {
  return document.querySelectorAll(query) as NodeListOf<T>
}

export function $s<T extends Element>(query:string) {
  return document.querySelector(query) as T | undefined
}
