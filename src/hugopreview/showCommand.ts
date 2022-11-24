import { QuickPickItem, window } from "vscode";
import { hugo, start, stop } from "./index";
import { open } from "./open";

interface CommandPickItem extends QuickPickItem {
  handler?: () => void;
  if?: boolean;
}

export async function showCommands() {
  const commands: CommandPickItem[] = [
    {
      label: "$(symbol-event) Start Hugo server",
      handler() {
        start({});
      },
      if: !hugo.active,
    },
    {
      label: "$(split-horizontal) Open in embedded browser",
      description: hugo.url,
      handler() {
        open({ autoStart: true, browser: "embedded" });
      },
    },
    {
      label: "$(link-external) Open in system browser",
      description: hugo.url,
      handler() {
        open({ autoStart: true, browser: "system" });
      },
    },
    {
      label: `$(refresh) Restart Hugo server`,
      async handler() {
        const reopen = hugo.panel && hugo.active;
        await start({});
        if (reopen) {
          await open({ browser: "embedded" });
        }
      },
      if: hugo.active,
    },

    {
      label: "$(terminal) Show Terminal",
      handler() {
        stop();
      },
      if: hugo.active,
    },
    {
      label: "$(close) Stop server",
      handler() {
        stop();
      },
      if: hugo.active,
    },
  ];

  const result = await window.showQuickPick<CommandPickItem>(
    commands.filter((i) => i.if !== false)
  );

  if (result) {
    result.handler?.();
  }
}
