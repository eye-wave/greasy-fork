import { $, $s } from "@repo/utils"

const randomInt = (max: number) => Math.floor(Math.random() * max)
const getRandomElement = <T>(array: ArrayLike<T>) => array[randomInt(array.length)]

const container = $s(".process")

if (container) {
  const button = document.createElement("span")
  button.textContent = "Solve"
  button.className = "qnav"

  button.addEventListener("click", handleButtonClick, { once: true })
  container.appendChild(button)
}

function handleButtonClick() {
  const agreeButton = $s<HTMLButtonElement>(".agree")
  const disagreeButton = $s<HTMLButtonElement>(".disagree")
  const ratingElements = Array.from({ length: 5 }).map((_, index) => $s<HTMLElement>(`.t${index + 1}`))
  const rangeInput = $s<HTMLInputElement>("input[type='range']")
  const finishButton = $s<HTMLButtonElement>("[data-finish]")

  const minValue = +(rangeInput?.getAttribute("min") ?? 0)
  const maxValue = +(rangeInput?.getAttribute("max") ?? 5) + 1

  const clickRandomRating = () => {
    if (ratingElements.every(element => element)) {
      getRandomElement(ratingElements)?.click()
      return
    }
    if (rangeInput) {
      rangeInput.value = `${randomInt(maxValue - minValue) + minValue}`
      return
    }

    if (agreeButton ?? disagreeButton) {
      Math.random() > 0.5 ? agreeButton?.click() : disagreeButton?.click()
      return
    }

    getRandomElement($<HTMLButtonElement>(".answer"))?.click()
  }

  clickRandomRating()
  setTimeout(handleButtonClick, 0)
  finishButton?.click()
}
