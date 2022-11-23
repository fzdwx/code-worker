import * as vscode from "vscode";
import { Command } from "../command";
import { existLang, langToExValPrefix } from "../utils";

export class CodeAction implements vscode.CodeActionProvider {
  public static readonly providerCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
    vscode.CodeActionKind.RefactorExtract,
  ];

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    let arr: (vscode.CodeAction | vscode.Command)[] = [];
    const line = document.lineAt(range.start.line);

    // 1.add semicolon
    if (
      !line.isEmptyOrWhitespace &&
      !line.text.endsWith(";") &&
      existLang(["java", "typescript", "rust", "c"])
    ) {
      arr.push(this.addSemicolon(document, range, line));
    }

    // 2.extract val
    if (!line.isEmptyOrWhitespace && line.text.indexOf("=") === -1) {
      const prefix = langToExValPrefix();
      if (
        // 当 line 不为空白 且 startWith != prefix 时才添加补全
        !line.text.trimStart().startsWith(prefix) ||
        // 以下语言也添加
        existLang(["python", "c"])
      ) {
        arr.push(this.extractVal(document, range, line, prefix));
      }
    }

    return arr;
  }

  extractVal(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    line: vscode.TextLine,
    prefix: string
  ): vscode.CodeAction | vscode.Command {
    const fix = new vscode.CodeAction(
      `extract variable`,
      vscode.CodeActionKind.RefactorExtract
    );

    const insertPos = new vscode.Position(
      range.start.line,
      line.range.end.character - line.text.trim().length - 1
    );

    fix.edit = new vscode.WorkspaceEdit();
    fix.edit.insert(document.uri, insertPos, `${prefix}  =`);

    const pos = new vscode.Position(
      range.start.line,
      insertPos.character + prefix.length + 1 // 移动一格
    );

    fix.command = Command.newSetSelectionCommand(
      new vscode.Selection(pos, pos)
    );
    return fix;
  }

  // addSemicolon, such as java, rust ,ts ...
  addSemicolon(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    line: vscode.TextLine
  ) {
    const fix = new vscode.CodeAction(
      `添加分号(add semicolon)`,
      vscode.CodeActionKind.QuickFix
    );
    fix.edit = new vscode.WorkspaceEdit();

    const end = new vscode.Position(
      line.lineNumber,
      line.range.end.character + 1
    );

    fix.edit.insert(document.uri, end, ";");

    return fix;
  }
}
