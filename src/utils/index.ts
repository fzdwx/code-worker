import * as vscode from "vscode";
export function findFirstIsNotWhitspace(str: string) {
  if (str === null || str === "") {
    return 0;
  }

  for (let index = 0; index < str.length; index++) {
    const element = str[index];
    if (element !== " ") {
      return index;
    }
  }

  return 0;
}

export function existLang(langArr: string[]) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return false;
  }

  const lang = editor.document.languageId;
  return langArr.indexOf(lang) !== -1;
}

export function langToExValPrefix() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return "";
  }

  const lang = editor.document.languageId;
  switch (lang) {
    case "java":
      return "var";
    case "rust":
      return "let";
    case "javascript":
    case "typescript:":
      return "const";
    case "go":
      return "var";
  }

  return "";
}
