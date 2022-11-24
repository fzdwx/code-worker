import * as http from "http";
import * as https from "https";
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
    case "typescript":
      return "const";
    case "go":
      return "var";
  }

  return "";
}

export const getIndentCharacters = () => {
  if (vscode.window.activeTextEditor?.options.insertSpaces) {
    return " ".repeat(vscode.window.activeTextEditor.options.tabSize as number);
  } else {
    return "\t";
  }
};
export const indent = getIndentCharacters;

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitFor(url: string, interval = 200, max = 30_000) {
  let times = Math.ceil(max / interval);

  while (times > 0) {
    times -= 1;
    if (await ping(url)) {
      return true;
    }
    await timeout(interval);
  }

  return false;
}

export function ping(url: string) {
  const promise = new Promise<boolean>((resolve) => {
    const useHttps = url.indexOf("https") === 0;
    const mod = useHttps ? https.request : http.request;

    const pingRequest = mod(url, () => {
      resolve(true);
      pingRequest.destroy();
    });

    pingRequest.on("error", () => {
      resolve(false);
      pingRequest.destroy();
    });

    pingRequest.write("");
    pingRequest.end();
  });
  return promise;
}
