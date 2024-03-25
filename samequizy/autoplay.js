// ==UserScript==
// @name           samequizy.pl - Autoplay off
// @name:en        samequizy.pl - Autoplay off
// @namespace      samequizy.pl utils
// @match          https://samequizy.pl/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=samequizy.pl
// @grant          none
// @version        2.0.2
// @author         eye-wave
// @license GPL    3.0
// @description    wyłącza automatyczne załączanie nowego quizu
// @description:en Disables the automatic loading of new quizzes on samequizy.pl.
// ==/UserScript==

const clickCancel = () => document.querySelector(".user-action.cancel")?.click()

function handleMutations(mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      if (document.querySelector(".result-container")?.style?.display !== "none") {
        clickCancel()
        break
      }
    }
  }
}

new MutationObserver(handleMutations).observe(document.body, {
  childList: true,
  subtree: true,
})
