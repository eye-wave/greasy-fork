import { copyToClipboard, $, $s } from "@repo/utils";

const btn = $s<HTMLButtonElement>(".save-playlist>button");
btn &&
  (btn.onclick = () => {
    const list = Array.from($(".fa-spotify"));
    const items = list.reduce((acc, item) => {
      const id = item.getAttribute("data-song-id");
      if (id) acc.push(id);

      return acc;
    }, [] as string[]);

    copyToClipboard(items.join("\n"));
  });
