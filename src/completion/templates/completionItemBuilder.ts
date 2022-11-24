import * as vsc from "vscode";
import { getIndentCharacters } from "../../utils";

export class CompletionItemBuilder {
  private item: vsc.CompletionItem;
  private keyword: string;

  constructor(keyword: string, private code: string) {
    this.keyword = keyword;
    this.item = new vsc.CompletionItem(keyword, vsc.CompletionItemKind.Snippet);
  }

  public static create = (keyword: string, code: string) =>
    new CompletionItemBuilder(keyword, code);

  public description = (desc: string) => {
    this.item.label = { label: this.keyword, description: desc };
    return this;
  };

  public detail = (detail: string) => {
    this.item.detail = detail;
    return this;
  };

  public documentation = (
    documentation: string | vsc.MarkdownString
  ): CompletionItemBuilder => {
    this.item.documentation = documentation;

    return this;
  };

  public command = (command: vsc.Command) => {
    this.item.command = command;
    return this;
  };

  public insertText = (insertText?: string) => {
    this.item.insertText = insertText;
    return this;
  };

  public deleteTextBeforeCursor = (position: vsc.Position, length: number) => {
    this.item.additionalTextEdits = [
      vsc.TextEdit.delete(
        new vsc.Range(position.translate(0, -length), position)
      ),
    ];
    return this;
  };

  public replace = (
    replacement: string,
    position: vsc.Position,
    useSnippets?: boolean
  ): CompletionItemBuilder => {
    const dotIdx = this.code.lastIndexOf(".");
    const codeBeforeTheDot = this.code.substr(0, dotIdx);

    if (useSnippets) {
      const escapedCode = codeBeforeTheDot.replace("$", "\\$");

      this.item.insertText = new vsc.SnippetString(
        replacement
          .replace(new RegExp("{{expr}}", "g"), escapedCode)
          .replace(new RegExp("{{indent}}", "g"), getIndentCharacters())
      );
    } else {
      this.item.insertText = replacement
        .replace(new RegExp("{{expr}}", "g"), codeBeforeTheDot)
        .replace(new RegExp("{{indent}}", "g"), getIndentCharacters());
    }

    this.item.additionalTextEdits = [
      vsc.TextEdit.delete(
        new vsc.Range(
          position.translate(0, -codeBeforeTheDot.length - 1),
          position
        )
      ),
    ];

    return this;
  };

  public build = () => this.item;
}
