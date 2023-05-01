import { window } from 'vscode';
import {
  quick,
  QuickTemplate,
  QuickTemplateDefinition
} from "../templates/quickTemplate";

const defs: QuickTemplateDefinition[] = [
  {
    lang: "go",
    keyword: "for",
    desc: "for {expr} { {end} }",
    body: "for {{expr}} {\n{{indent}}$1\n}\n",
  },
  {
    lang: "go",
    keyword: "fori",
    desc: "for i := 0; i < {{expr}}; i++ { {end} }",
    body: "for i := 0; i < {{expr}}; i++ {\n{{indent}}$1\n}\n",
  },
  {
    lang: "go",
    keyword: "forr",
    desc: "",
    body: "for $1,$2 := range {{expr}} {\n{{indent}}$0\n}\n",
  },
  {
    lang: "go",
    keyword: "if",
    desc: "",
    body: "if {{expr}} {\n{{indent}}$1\n}\n",
  },
  { lang: "go", keyword: "len", desc: "", body: "len({{expr}})" },

  {
    lang: "javascript",
    keyword: "fori",
    desc: "",
    body: "for (let i = 0; i < {{expr}}.length; i++) {\n{{indent}}const item = {{expr}}[i];$0\n}",
  },
  {
    lang: "javascript",
    keyword: "forin",
    desc: "",
    body: "for (var key in {{expr}}) {\n{{indent}} if (Object.hasOwnProperty.call({{expr}}, key)) {\n{{indent}}{{indent}}$0\n{{indent}}}\n}",
  },
  {
    lang: "javascript",
    keyword: "forof",
    desc: "",
    body: "for (let obj of {{expr}}) {\n{{indent}}$0\n}",
  },
  {
    lang: "javascript",
    keyword: "if",
    desc: "",
    body: "if ({{expr}}) {\n{{indent}}${0}\n}",
  },
  {
    lang: "javascript",
    keyword: "else",
    desc: "",
    body: "if (!{{expr}}) {\n${{indent}}${0}\n}",
  },
  { lang: "javascript", keyword: "not", desc: "", body: "!{{expr}}" },
  {
    lang: "javascript",
    keyword: "return",
    desc: "",
    body: "return {{expr}}",
  },
  {
    lang: "javascript",
    keyword: "var",
    desc: "",
    body: "var $1 = {{expr}}\n$0",
  },
  {
    lang: "javascript",
    keyword: "let",
    desc: "",
    body: "let $1 = {{expr}}\n$0",
  },
  {
    lang: "javascript",
    keyword: "const",
    desc: "",
    body: "const $1 `= {{expr}}\n$0",
  },
  {
    lang: "javascript",
    keyword: "await",
    desc: "",
    body: "await {{expr}}",
  },
  {
    lang: "javascript",
    keyword: "log",
    desc: "",
    body: "console.log({{expr}})",
  },
  {
    lang: "javascript",
    keyword: "warn",
    desc: "",
    body: "console.warn({{expr}})",
  },
  {
    lang: "javascript",
    keyword: "error",
    desc: "",
    body: "console.error({{expr}})",
  },

  {
    lang: "typescript",
    keyword: "fori",
    desc: "",
    body: "for (let i = 0; i < {{expr}}.length; i++) {\n{{indent}}const item = {{expr}}[i];$0\n}",
  },
  {
    lang: "typescript",
    keyword: "forin",
    desc: "",
    body: "for (var key in {{expr}}) {\n{{indent}} if (Object.hasOwnProperty.call({{expr}}, key)) {\n{{indent}}{{indent}}$0\n{{indent}}}\n}",
  },
  {
    lang: "typescript",
    keyword: "forof",
    desc: "",
    body: "for (let obj of {{expr}}) {\n{{indent}}$0\n}",
  },
  {
    lang: "typescript",
    keyword: "if",
    desc: "",
    body: "if ({{expr}}) {\n{{indent}}${0}\n}",
  },
  {
    lang: "typescript",
    keyword: "else",
    desc: "",
    body: "if (!{{expr}}) {\n${{indent}}${0}\n}",
  },
  { lang: "typescript", keyword: "not", desc: "", body: "!{{expr}}" },
  {
    lang: "typescript",
    keyword: "return",
    desc: "",
    body: "return {{expr}}",
  },
  {
    lang: "typescript",
    keyword: "var",
    desc: "",
    body: "var $1 = {{expr}}\n$0",
  },
  {
    lang: "typescript",
    keyword: "let",
    desc: "",
    body: "let $1 = {{expr}}\n$0",
  },
  {
    lang: "typescript",
    keyword: "const",
    desc: "",
    body: "const $1 `= {{expr}}\n$0",
  },
  {
    lang: "typescript",
    keyword: "await",
    desc: "",
    body: "await {{expr}}",
  },
  {
    lang: "typescript",
    keyword: "log",
    desc: "",
    body: "console.log({{expr}})",
  },
  {
    lang: "typescript",
    keyword: "warn",
    desc: "",
    body: "console.warn({{expr}})",
  },
  {
    lang: "typescript",
    keyword: "error",
    desc: "",
    body: "console.error({{expr}})",
  },

  {
    lang: "rust",
    keyword: "assert",
    desc: "",
    body: "assert_eq!({{expr}},$1);$0",
  },
  { lang: "rust", keyword: "ok", desc: "", body: "Ok({{expr}})" },
  { lang: "rust", keyword: "par", desc: "", body: "({{expr}})" },
  {
    lang: "rust",
    keyword: "println",
    desc: "",
    body: 'println!("{:?}", {{expr}});',
  },
  { lang: "rust", keyword: "def", desc: "", body: "&{{expr}}" },
  { lang: "rust", keyword: "deref", desc: "", body: "*{{expr}}" },
  { lang: "rust", keyword: "defm", desc: "", body: "&mut {{expr}}" },
  { lang: "rust", keyword: "some", desc: "", body: "Some({{expr}})" },
  { lang: "rust", keyword: "err", desc: "", body: " Err({{expr}})" },
  { lang: "rust", keyword: "lambda", desc: "", body: "|| {{expr}}" },
  { lang: "rust", keyword: "struct", desc: "quick new struct", body: "struct {{expr}} {\n${{indent}}${0}\n}" },
  {
    lang: "rust",
    keyword: "for",
    desc: "",
    body: "for $1 in {{expr}} {\n${{indent}}${0}\n}",
  },
];

export const quickTemplates: QuickTemplate[] = defs.map((def) => {
  return quick(def.lang, def.keyword, def.desc, def.body);
});
