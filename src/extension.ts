import { closeTerminal, hugoInit as hugoAppInit } from "./hugopreview/index";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CodeAction } from "./codeaction";
import { setSelectionCmd, setSelectionHandle } from "./command";
import { loadPostfixCmp } from "./completion";

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

  ["go", "javascript", "typescript", "c", "rust", "java"].forEach((lang) => {
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        lang,
        loadPostfixCmp(lang),
        "."
      )
    );
  });

  hugoAppInit(context);
}

// This method is called when your extension is deactivated
export function deactivate() {
  closeTerminal();
}
