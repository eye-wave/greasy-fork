/* DELETE */ import van from "vanjs-core"
import type { State } from "vanjs-core"
import folderIcon from "../icons/folder.svg"
import folderOpenIcon from "../icons/folder-open.svg"
import { button, i, div } from "../utils/tags"

const FolderIcon = (open: boolean) => i({ innerHTML: open ? folderOpenIcon : folderIcon })

type BackpackProps = {
  isOpen: State<boolean>
}

export const Backpack = ({ isOpen }: BackpackProps) => {
  const styles = ["width: 100%", "height:100%", "position:absolute", "top:0"]
  const dom = div({ style: styles.join(";") }, () => (isOpen.val ? div("Hello World!") : ""))

  van.derive(() => {
    dom.style.background = isOpen.val ? "#00000080" : ""
  })

  return () => dom
}

type BackpackButtonProps = {
  isOpen: State<boolean>
  marginTop?: number
}

export const BackpackButton = ({ marginTop = 54, isOpen }: BackpackButtonProps) => {
  return button(
    {
      class: "bookmark",
      style: `top: ${marginTop}px`,
      onclick() {
        isOpen.val = !isOpen.val
      },
    },
    () => FolderIcon(isOpen.val)
  )
}
