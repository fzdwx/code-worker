import { CompletionItem, Position } from "vscode";
import { BaseExpressionTemplate } from "../templates/baseTemplates";
import { CompletionItemBuilder } from "../templates/completionItemBuilder";

export class RetTmp extends BaseExpressionTemplate {
  buildCompletionItem(code: string, position: Position): CompletionItem {
    let expr = this.parseExpr(code, position);
    return CompletionItemBuilder.create("ret", code)
      .documentation(`return ${expr}`)
      .description("retrun ${expr}")
      .replace(`return \${1:{{expr}}}\${0}`, position, true)
      .build();
  }

  canUse(code: string, position: Position, lang: string): boolean {
    return !code.trim().startsWith("return");
  }
}
