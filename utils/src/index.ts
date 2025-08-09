export function $<T extends Element>(query: string) {
  return document.querySelectorAll(query) as NodeListOf<T>
}

export function $s<T extends Element>(query: string) {
  return document.querySelector(query) as T | undefined
}

export function copyToClipboard<T>(data: T): void {
  try {
    const text = typeof data === "string" ? data : JSON.stringify(data)
    navigator.clipboard.writeText(text)
  } catch {
    const textarea = document.createElement("textarea")
    textarea.value = typeof data === "string" ? data : JSON.stringify(data)
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand("copy")
    document.body.removeChild(textarea)
  }
}
