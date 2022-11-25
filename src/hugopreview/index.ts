import {
  commands,
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  Terminal,
  window,
} from "vscode";
import { timeout, waitFor } from "../utils";
import { Config } from "./config";
import { open } from "./open";
import { showCommands } from "./showCommand";

export interface HugoPreview {
  ext: ExtensionContext;
  terminal: Terminal;
  statusBar: StatusBarItem;
  active: boolean;
  port?: number;
  url?: string;
  panel?: any;
  command: string;
}

export const hugo = {
  active: false,
  port: Config.port,
  command: "hugo server -D",
} as HugoPreview;

export function hugoInit(context: ExtensionContext) {
  hugo.ext = context;
  context.subscriptions.push(
    commands.registerCommand("hugo.showCommands", () => {
      showCommands();
    })
  );

  context.subscriptions.push(
    commands.registerCommand("hugo.stop", () => {
      stop();
    })
  );
  context.subscriptions.push(
    commands.registerCommand("hugo.restart", () => {
      start({});
    })
  );

  context.subscriptions.push(
    commands.registerCommand("hugo.open", () => open())
  );
}

export async function start({ stopPrevious = true }) {
  if (stopPrevious) {
    stop();
  }

  hugo.url = `http://localhost:${hugo.port}`;
  hugo.ext.globalState.update("port", hugo.port);

  let command = hugo.command;
  command += ` -p ${hugo.port}`;
  executeCommand(command);

  if (!(await waitFor(hugo.url, Config.pingInterval, Config.maximumTimeout))) {
    window.showErrorMessage("❗️ Failed to start the server");
    stop();
  } else {
    if (Config.notifyOnStarted) {
      window.showInformationMessage(
        `⚡️ ${hugo.command} started at ${hugo.url}`
      );
    }
  }

  hugo.active = true;
  updateStatusBar();
}

export function stop() {
  hugo.active = false;
  endProcess();
  updateStatusBar();
}

function updateStatusBar() {
  ensureStatusBar();
  if (hugo.active) {
    hugo.statusBar.text = "$(symbol-event) hugo";
    hugo.statusBar.color = "#ebb549";
  } else {
    hugo.statusBar.text = "$(stop-circle) hugo";
    hugo.statusBar.color = undefined;
  }
}

function ensureStatusBar() {
  if (!hugo.statusBar) {
    hugo.statusBar = window.createStatusBarItem(StatusBarAlignment.Right, 1000);
    hugo.statusBar.command = "hugo.showCommands";
    hugo.statusBar.show();
  }
}
async function executeCommand(cmd: string) {
  ensureTerminal();
  hugo.terminal.sendText(cmd);
  hugo.terminal.show(true);
  await timeout(2000);
  const pid = await hugo.terminal.processId;
  if (pid) {
    hugo.ext.globalState.update("pid", pid);
  }
}

function ensureTerminal() {
  if (isTerminalActive()) {
    return;
  }

  hugo.terminal = window.createTerminal("Hugo");
}

export function closeTerminal() {
  if (isTerminalActive()) {
    hugo.terminal.sendText("\x03");
    hugo.terminal.dispose();
    hugo.terminal = undefined!;
  }
}

export function endProcess() {
  if (isTerminalActive()) {
    hugo.terminal.sendText("\x03");
    hugo.terminal.dispose();
    window.showInformationMessage("hugo server stoped");
  }
  hugo.ext.globalState.update("pid", undefined);
}

function isTerminalActive() {
  return hugo.terminal;
}
