import { $s } from "@repo/utils";

const btn = $s<HTMLAnchorElement>("a.primary");
if (btn) {
  const url = "spotify" + location.pathname.replace("/", ":");

  btn.href = url;
  btn.textContent = "Open in App";
}
