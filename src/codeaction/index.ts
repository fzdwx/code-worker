import * as vscode from "vscode";
import { Command } from "../command";
import {
  existLang,
  findFirstIsNotWhitspace,
  langToExValPrefix,
} from "../utils";

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
    if (
      !line.isEmptyOrWhitespace &&
      !line.text.endsWith(";") &&
      existLang(["java", "typescript", "rust"])
    ) {
      arr.push(this.addSemicolon(document, range));
    }

    // 当 line 不为空白 且 startWith != prefix 时才添加补全
    if (!line.isEmptyOrWhitespace) {
      const prefix = langToExValPrefix();
      if (!line.text.trimStart().startsWith(prefix)) {
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
      findFirstIsNotWhitspace(line.text)
    );

    fix.edit = new vscode.WorkspaceEdit();
    fix.edit.insert(document.uri, insertPos, `${prefix}  = `);

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
    range: vscode.Range | vscode.Selection
  ) {
    const fix = new vscode.CodeAction(
      `add semicolon`,
      vscode.CodeActionKind.QuickFix
    );
    fix.edit = new vscode.WorkspaceEdit();
    fix.edit.replace(
      document.uri,
      new vscode.Range(range.start, range.start.translate(0, 2)),
      ";"
    );

    return fix;
  }
}
