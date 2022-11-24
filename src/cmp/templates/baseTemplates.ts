import * as vsc from "vscode";
import { IPostfixTemplate } from "..";
export abstract class BaseTemplate implements IPostfixTemplate {
  abstract buildCompletionItem(
    code: string,
    position: vsc.Position,
    suffix: string
  ): vsc.CompletionItem;
  abstract canUse(code: string, position: vsc.Position, lang: string): boolean;

  parseExpr(code: string, position: vsc.Position): string {
    const dotIdx = code.lastIndexOf(".", position.character);
    const input = code.substr(0, dotIdx);
    if (input.length === 0) {
      return "";
    }
    let lastComponent = "";
    for (let i = 0; i < input.length; i++) {
      let character = input.substr(input.length - i - 1, 1);
      if (!character.match(/[a-zA-Z0-9\(\)\[\]\.]/)) {
        return lastComponent;
      }

      lastComponent = character + lastComponent;
    }
    return lastComponent;
  }
}

export abstract class BaseExpressionTemplate extends BaseTemplate {
  abstract buildCompletionItem(
    code: string,
    position: vsc.Position
  ): vsc.CompletionItem;

  canUse(code: string, position: vsc.Position, lang: string) {
    // TODO: Parse code
    return true;
  }
}
