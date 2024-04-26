/* DELETE */ import van from "vanjs-core"
import { waitFor } from "./utils/waitFor"
import { Backpack, BackpackButton } from "./components/Backpack"
import { $s } from "@repo/utils"
import { loadDatabase } from "./database"

waitFor<HTMLDivElement>(".sw-Loader[style='display: none;']", 30_000).then(async () => {
  waitFor<HTMLDivElement>(".bookmark-icon").then(btn => btn.remove())

  const db = await loadDatabase()
  const items = db.transaction(["image_maker_parts"], "readonly").objectStore("image_maker_parts").getAll()

  console.log(items)

  const container = $s<HTMLDivElement>(".play-Container_Imagemaker")
  const containerRight = $s<HTMLDivElement>(".play-Container_Right")
  const canvasWrapper = $s<HTMLDivElement>(".imagemaker_canvas_wrapper")

  if (!canvasWrapper || !containerRight || !container) throw Error()

  containerRight.childNodes.forEach(node => node.remove())
  const isBackpackOpen = van.state(false)

  van.add(canvasWrapper, BackpackButton({ isOpen: isBackpackOpen }))
  van.add(document.body, Backpack({ isOpen: isBackpackOpen }))
})
