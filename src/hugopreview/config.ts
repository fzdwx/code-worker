import { workspace } from "vscode";

export function getConfig<T>(key: string, v?: T) {
  return workspace.getConfiguration().get(`hugo.${key}`, v);
}

export const Config = {
  get root() {
    return workspace.workspaceFolders?.[0]?.uri?.fsPath || "";
  },

  get browser() {
    return getConfig<"system" | "embedded">("browserType", "embedded")!;
  },

  get pingInterval() {
    return getConfig("pingInterval", 200)!;
  },

  get maximumTimeout() {
    return getConfig("maximumTimeout", 30_000)!;
  },

  get showTerminal() {
    return getConfig("showTerminal", false)!;
  },

  get notifyOnStarted() {
    return getConfig("notifyOnStarted", true)!;
  },

  get port() {
    return getConfig("port", 4000)!;
  },

  get host() {
    return getConfig("host", "localhost")!;
  },

  get https() {
    return getConfig("https", false)!;
  },

  get base() {
    return getConfig("base", "")!;
  },

  get buildCommand() {
    return getConfig("buildCommand", "npm run build")!;
  },

  get devCommand(): string | undefined {
    return getConfig("devCommand");
  },

  get open(): boolean {
    return getConfig("open") ?? true;
  },
};
