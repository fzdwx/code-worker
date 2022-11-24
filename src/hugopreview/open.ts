import { commands, env, Uri } from "vscode";
import { hugo, start } from ".";
import { Config } from "./config";

export async function open({
  autoStart = true,
  browser = Config.browser,
  stopPrevious = true,
} = {}) {
  if (!hugo.active && autoStart) {
    await start({ stopPrevious });
  }

  if (!hugo.active || !hugo.url) {
    return;
  }

  if (browser === "system") {
    env.openExternal(Uri.parse(hugo.url));
  } else if (browser === "embedded") {
    if (!hugo.panel || hugo.panel?.disposed) {
      // all the hard work are done in:
      // https://github.com/antfu/vscode-browse-lite
      hugo.panel = await commands.executeCommand("browse-lite.open", hugo.url);
    }
    try {
      hugo.panel?.show?.();
    } catch {}
  }
}

export function closePanel() {
  hugo.panel?.dispose?.();
  hugo.panel = undefined;
}
