import { CompletionItem, Position } from "vscode";
import { quickTemplates } from "./builtIn/quick";

/* 
inspired from https://github.com/yokoe/vscode-postfix-go
*/

import { RefTmp } from "./builtIn/ref";
import { RetTmp } from "./builtIn/ret";
import { PostfixCompletionProvider } from "./postfixCompletionProvider";

export function loadPostfixCmp(lang: string) {
  const provider = new PostfixCompletionProvider(lang);

  provider.push(new RefTmp());
  provider.push(new RetTmp());
  provider.push(...quickTemplates);

  return provider;
}

export interface IPostfixTemplate {
  buildCompletionItem(
    code: string,
    position: Position,
    suffix: string
  ): CompletionItem;

  canUse(code: string, position: Position, lang: string): boolean;
}
