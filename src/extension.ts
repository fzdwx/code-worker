import { closeTerminal, hugo, start, stop } from "./hugopreview/index";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CodeAction } from "./codeaction";
import { setSelectionCmd, setSelectionHandle } from "./command";
import { loadPostfixCmp } from "./completion";
import { open } from "./hugopreview/open";
import { showCommands } from "./hugopreview/showCommand";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider("*", new CodeAction(), {
      providedCodeActionKinds: CodeAction.providerCodeActionKinds,
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(setSelectionCmd, setSelectionHandle)
  );

  hugo.ext = context;
  context.subscriptions.push(
    vscode.commands.registerCommand("hugo.showCommands", () => {
      showCommands();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("hugo.stop", () => {
      stop();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("hugo.restart", () => {
      start({});
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("hugo.open", () => open())
  );

  ["go", "javascript", "typescript", "c", "rust", "java"].forEach((lang) => {
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        lang,
        loadPostfixCmp(lang),
        "."
      )
    );
  });
}

// This method is called when your extension is deactivated
export function deactivate() {
  closeTerminal();
}
