// ==UserScript==
// @name        idrlabs.com - Solver
// @namespace   Violentmonkey Scripts
// @match       https://www.idrlabs.com/*/test.php
// @icon        https://www.google.com/s2/favicons?sz=64&domain=idrlabs.com
// @grant       none
// @version     1.1.1
// @author      eye-wave
// @license GPL 3.0
// @description creates a button to solve the quiz with random answers
// ==/UserScript==

const select = selector => document.querySelector(selector)
const randomInt = max => Math.floor(Math.random() * max)
const getRandomElement = array => array[randomInt(array.length)]

const container = document.querySelector(".process")

if (container) {
  const button = document.createElement("span")
  button.textContent = "Solve"
  button.className = "qnav"

  button.addEventListener("click", handleButtonClick, { once: true })
  container.appendChild(button)
}

function handleButtonClick() {
  const agreeButton = select(".agree")
  const disagreeButton = select(".disagree")
  const ratingElements = Array.from({ length: 5 }).map((_, index) => select(`.t${index + 1}`))
  const rangeInput = select("input[type='range']")
  const finishButton = select("[data-finish]")

  const minValue = +rangeInput?.getAttribute("min") || 0
  const maxValue = (+rangeInput?.getAttribute("max") || 5) + 1

  const clickRandomRating = () => {
    if (ratingElements.every(element => element)) {
      getRandomElement(ratingElements).click()
    } else if (rangeInput) {
      rangeInput.value = randomInt(maxValue - minValue) + minValue
    } else if (agreeButton || disagreeButton) {
      Math.random() > 0.5 ? agreeButton.click() : disagreeButton.click()
    } else {
      getRandomElement(document.querySelectorAll(".answer")).click()
    }
  }

  clickRandomRating()
  setTimeout(handleButtonClick, 0)
  finishButton.click()
}
