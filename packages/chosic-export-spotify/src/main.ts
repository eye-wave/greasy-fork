import { copyToClipboard } from "@repo/utils";

const list = Array.from(document.querySelectorAll(".fa-spotify"));
const items = list.reduce((acc, item) => {
  const id = item.getAttribute("data-song-id");
  if (id) acc.push(id);

  return acc;
}, [] as string[]);

copyToClipboard(items.join("\n"));
