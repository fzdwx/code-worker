import { CompletionItem, Position } from "vscode";
import { BaseExpressionTemplate } from "../templates/baseTemplates";
import { CompletionItemBuilder } from "../templates/completionItemBuilder";

const support_lang = ["c", "rust", "go"];

export class RefTmp extends BaseExpressionTemplate {
  buildCompletionItem(code: string, position: Position): CompletionItem {
    let expr = this.parseExpr(code, position);

    return CompletionItemBuilder.create("ref", expr)
      .documentation(`${expr}.ref -> &${expr}`)
      .description("${expr}.ref -> &${expr}")
      .deleteTextBeforeCursor(position, expr.length + 1)
      .insertText(`&${expr}`)
      .build();
  }

  canUse(code: string, position: Position, lang: string): boolean {
    if (!support_lang.indexOf(lang)) {
      return false;
    }
    let expr = this.parseExpr(code, position);
    return code.substring(0, code.indexOf(expr)).indexOf("&") === -1;
  }
}
