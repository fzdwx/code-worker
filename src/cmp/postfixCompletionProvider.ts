import * as vsc from "vscode";
import { IPostfixTemplate } from ".";

let currentSuggestion: string | vsc.CompletionItemLabel | undefined = undefined;

export class PostfixCompletionProvider implements vsc.CompletionItemProvider {
  private templates: IPostfixTemplate[] = [];
  private lang: string;
  constructor(lang: string) {
    this.lang = lang;
  }

  provideCompletionItems(
    document: vsc.TextDocument,
    position: vsc.Position,
    token: vsc.CancellationToken
  ):
    | vsc.CompletionItem[]
    | vsc.CompletionList
    | Thenable<vsc.CompletionItem[] | vsc.CompletionList> {
    let line = document.lineAt(position.line);
    let dotIdx = line.text.lastIndexOf(".", position.character);

    if (dotIdx === -1) {
      return [];
    }

    let code = line.text.substr(line.firstNonWhitespaceCharacterIndex);

    const commentIndex = line.text.indexOf("//");
    if (commentIndex >= 0 && position.character > commentIndex) {
      return [];
    }

    return this.templates
      .filter((t) => t.canUse(code, position, this.lang))
      .map((t) =>
        t.buildCompletionItem(
          code,
          position,
          line.text.substring(dotIdx + 1, position.character)
        )
      );
  }

  resolveCompletionItem(
    item: vsc.CompletionItem,
    token: vsc.CancellationToken
  ): vsc.ProviderResult<vsc.CompletionItem> {
    currentSuggestion = item.label;
    return item;
  }

  public push(...tpl: IPostfixTemplate[]) {
    this.templates.push(...tpl);
  }
}

export const getCurrentSuggestion = () => currentSuggestion;
