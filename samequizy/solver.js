// ==UserScript==
// @name           samequizy.pl - Quiz solver
// @name:en        samequizy.pl - Quiz solver
// @namespace      samequizy.pl utils
// @match          https://samequizy.pl/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=samequizy.pl
// @grant          none
// @version        2.0.3
// @author         eye-wave
// @license GPL    3.0
// @description    tworzy przycisk do natychmiastowego rozwiązania quizu
// @description:en creates a button for solving the quiz instantly
// ==/UserScript==

const IMAGE_HEIGHT = 96

function createButton() {
  const button = document.createElement("button")
  button.textContent = "Rozwiąż"
  button.className = "follow-btn user-action"

  const [parentElement] = document.getElementsByClassName("pull-right") ?? [document.body]
  const [insertBeforeElement] = document.getElementsByClassName("fav-btn") ?? []

  if (!insertBeforeElement) {
    parentElement.append(button)
    return
  }

  parentElement.insertBefore(button, insertBeforeElement)
  button.addEventListener("click", handleButtonClick)

  function handleButtonClick() {
    const quizdata = getQuizData()
    const modal = createModal(quizdata)

    modal.onclose = id => {
      if (typeof id !== "string") return
      if (id === "act__quit") return
      if (id === "ans__random") {
        document.querySelectorAll(".question-answers").forEach(question => {
          const answerElements = question.querySelectorAll(".answer")
          const randomAnswer = answerElements[Math.floor(Math.random() * answerElements.length)]

          randomAnswer?.click()
        })

        return
      }

      try {
        solve(quizdata, id)
      } catch {}

      button.remove()
    }
  }
  return button
}

function createModal(quizdata) {
  const dialog = document.createElement("dialog")
  const dialogStyles = [
    "padding: 2rem",
    "display: flex",
    "flex-wrap: wrap",
    "justify-content: center",
    "align-items: center",
    "gap: 2rem",
    "background: #b3b3b3",
    "border:0",
  ]

  dialog.style = dialogStyles.join(";")

  function createAnswerElement(img, id, title) {
    const div = document.createElement("div")
    div.className = "answer-inner"
    div.dataset.id = id
    div.style.width = "fit-content"

    if ( title.length > 18 ) title = title.substring(0, 17) + "..."

    div.innerHTML += `<div class="text">${title}</div>`
    if (img) div.innerHTML += img

    return div
  }

  const elements = quizdata.results.map((result, i) => {
    const imgSrc = result.description.match(/https?:\/\/.+\.jpe?g/)?.[0]?.replace(/https?/, "https")

    const { id, title = `Opcja ${i}` } = result
    const img = `<img src="${imgSrc}" height="${IMAGE_HEIGHT}px">`

    return createAnswerElement(img, id, title)
  })

  elements.push(
    createAnswerElement(
      `<svg height="${IMAGE_HEIGHT}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><g fill="currentColor" fill-rule="evenodd"><path d="M48 88c0-4 3-10 7-12l66-40c4-2 10-2 14 0l66 40c4 2 7 8 7 12v80c0 4-3 10-7 12l-66 40c-4 2-10 2-14 0l-66-40c-4-2-7-8-7-12zm14-6 66 36 62-36-62-37-66 37zm-4 12-1 71c-1 3 1 5 3 6l61 38 1-78S58 92 58 94zm76 114 61-38c2-2 4-5 4-8V93l-65 38z"/><path d="M78 132c-5 3-11 1-14-4s-2-12 3-15 11 0 14 5 2 12-3 14m32 21c-5 3-11 1-14-4-3-6-2-12 3-15s11-1 14 5c3 5 2 12-3 14m-32 16c-5 3-11 1-14-4-3-6-2-12 3-15s11-1 14 5c3 5 2 12-3 14m32 21c-5 3-11 1-14-4-3-6-2-12 3-15s11-1 14 5c3 5 2 12-3 14m78-78c-5-3-11-1-14 5-3 5-2 12 3 14 5 3 11 1 14-4s2-12-3-15m-16 29c-5-3-11 0-14 5s-2 12 3 14c5 3 11 1 14-4s2-12-3-15m-17 28c-5-3-11 0-14 5s-2 12 3 14c5 3 11 1 14-4s2-12-3-15M129 69c-7 0-12 5-12 11s5 11 12 11 11-5 11-11-5-11-11-11"/></g></svg>`,
      "ans__random",
      "Losowa"
    )
  )

  elements.push(
    createAnswerElement(
      `<svg height="${IMAGE_HEIGHT}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m12 13.4-2.9 2.9q-.3.3-.7.3t-.7-.3q-.3-.3-.3-.7t.3-.7l2.9-2.9-2.9-2.9q-.3-.2-.3-.7t.3-.7q.3-.2.7-.2t.7.2l2.9 3 2.9-3q.2-.2.7-.2t.7.2q.3.3.3.7t-.3.7l-3 2.9 3 2.9q.2.3.2.7t-.2.7q-.3.3-.7.3t-.7-.3z"/></svg>`,
      "act__quit",
      ""
    )
  )

  elements.forEach(element => {
    dialog.append(element)
    element.addEventListener("click", () => {
      dialog.onclose(element.dataset.id)
      dialog.close()
      dialog.remove()
    })
  })

  dialog.addEventListener("keydown", e => {
    if (e.key === "Escape") e.preventDefault()
  })

  document.body.append(dialog)
  dialog.showModal()

  return dialog
}

function getQuizData() {
  const [script] = [...document.querySelectorAll("script")].filter(script => script.innerHTML.includes("var quizData"))

  if (!script) throw Error()

  const [quizData] = script.innerHTML.match(/var quizData = .+;$/m) ?? []
  if (!quizData) throw Error()

  return JSON.parse(quizData.slice(15, -1))
}

function solve(quizdata, resultId) {
  document.querySelectorAll(".question-answers").forEach((question, i) => {
    const questionData = quizdata.questions[i]
    if (!questionData) return

    const answer = questionData.answers
      .map(answer => {
        const ids = answer.result.split(",")

        let score = 0
        for (const id of ids) {
          if (id === resultId) score++
        }

        return { score, answer }
      })
      .sort((a, b) => a.score - b.score)
      .at(-1)?.answer

    if (!answer) return
    const answerElements = [...question.querySelectorAll(".answer")]
    const [pickedAnswer] = answerElements.filter(el => el.textContent === answer.text) ?? []

    pickedAnswer?.click()
  })
}

createButton()
