import quitIcon from "./icons/quit.svg"
import randomIcon from "./icons/random.svg"

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
    try {
      const quizdata = getQuizData()
      const modal = createModal(quizdata)

      modal.onclose = id => {
        if (typeof id !== "string") return
        if (id === "act__quit") return
        if (id === "ans__random") return answerRandomly()

        try {
          solve(quizdata, id)
        } catch {}

        button.remove()
      }
    } catch {}
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

  dialog.setAttribute("style", dialogStyles.join(";"))

  function createAnswerElement(img, id, title) {
    const div = document.createElement("div")
    div.className = "answer-inner"
    div.dataset.id = id
    div.style.width = "fit-content"

    if (title.length > 18) title = `${title.substring(0, 17)}...`

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
    createAnswerElement(randomIcon.replace(/height="\d+"/, `height="${IMAGE_HEIGHT}"`), "ans__random", "Losowa")
  )

  elements.push(createAnswerElement(quitIcon.replace(/height="\d+"/, `height="${IMAGE_HEIGHT}"`), "act__quit", ""))

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

    if (!answer) throw Error()
    const answerElements = [...question.querySelectorAll(".answer")]
    const [pickedAnswer] = answerElements.filter(el => el.textContent === answer.text) ?? []

    pickedAnswer?.click()
  })
}

function answerRandomly() {
  document.querySelectorAll(".question-answers").forEach(question => {
    const answerElements = question.querySelectorAll(".answer")
    const randomAnswer = answerElements[Math.floor(Math.random() * answerElements.length)]

    randomAnswer?.click()
  })
}

createButton()
