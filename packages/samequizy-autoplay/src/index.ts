const removeNextRelated = () => document.querySelector(".next-related")?.remove()
removeNextRelated()

new MutationObserver(mutationsList => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") removeNextRelated()
  }
}).observe(document.body, {
  childList: true,
  subtree: true,
})
