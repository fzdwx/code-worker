import { CompletionItem, Position } from "vscode";
import { IPostfixTemplate } from "..";
import { BaseExpressionTemplate } from "./baseTemplates";
import { CompletionItemBuilder } from "./completionItemBuilder";
export function quick(
  lang: string,
  keyword: string,
  desc: string,
  body: string,
  detail?: string
): QuickTemplate {
  return new QuickTemplate(keyword, lang, body, desc, detail);
}

export class QuickTemplate
  extends BaseExpressionTemplate
  implements IPostfixTemplate
{
  keyword: string;
  lang: string;
  body: string;
  desc: string;
  detail?: string;
  constructor(
    keyword: string,
    lang: string,
    body: string,
    desc: string,
    detail?: string
  ) {
    super();
    this.keyword = keyword;
    this.lang = lang;
    this.body = body;
    this.desc = desc;
    this.detail = detail;
  }

  buildCompletionItem(code: string, position: Position): CompletionItem {
    const cmp = CompletionItemBuilder.create(this.keyword, code)
      .description(this.desc)
      .replace(this.body, position, true)
      .build();
    this.detail;

    return cmp;
  }

  canUse(code: string, position: Position, lang: string): boolean {
    return this.lang === lang;
  }
}

export interface QuickTemplateDefinition {
  lang: string;
  keyword: string;
  desc: string;
  body: string;
}
