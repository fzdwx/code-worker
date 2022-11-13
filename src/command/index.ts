import * as vscode from "vscode";

export class Command implements vscode.Command {
  title: string;
  command: string;
  tooltip?: string | undefined;
  arguments?: any[] | undefined;

  constructor(title: string, command: string) {
    this.command = command;
    this.title = title;
  }

  public static newSetSelectionCommand(selection: vscode.Selection) {
    let cmd = new Command("set selection !!", "inf.setSelection");
    cmd.arguments = [selection];
    return cmd;
  }
}

export const setSelectionCmd = "inf.setSelection";

export function setSelectionHandle(selection: vscode.Selection) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  editor.selection = selection;
}
