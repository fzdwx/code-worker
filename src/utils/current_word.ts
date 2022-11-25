import * as vscode from "vscode";

/**
 * get current word
 * @returns {text:string, range: vscode.range}
 */
export function currentWord() {
  const editor = vscode.window.activeTextEditor;
  if (editor === undefined) {
    return undefined;
  }

  const { document, selection } = editor;
  return getSelectedText(selection, document);
}

function getSelectedText(
  selection: vscode.Selection,
  document: vscode.TextDocument
): { text: string; range: vscode.Range } {
  let range: vscode.Range;

  if (isRangeSimplyCursorPosition(selection)) {
    // @ts-ignore
    range = getChangeCaseWordRangeAtPosition(document, selection.end);
  } else {
    range = new vscode.Range(selection.start, selection.end);
  }

  return {
    // @ts-ignore
    text: range ? document.getText(range) : undefined,
    range,
  };
}

function isRangeSimplyCursorPosition(range: vscode.Range): boolean {
  return (
    range.start.line === range.end.line &&
    range.start.character === range.end.character
  );
}

const CHANGE_CASE_WORD_CHARACTER_REGEX = /([\w_\.\-\/$]+)/;
const CHANGE_CASE_WORD_CHARACTER_REGEX_WITHOUT_DOT = /([\w_\-\/$]+)/;

function getChangeCaseWordRangeAtPosition(
  document: vscode.TextDocument,
  position: vscode.Position
) {
  const configuration = vscode.workspace.getConfiguration("changeCase");
  const includeDotInCurrentWord = configuration
    ? configuration.get("includeDotInCurrentWord", false)
    : false;
  const regex = includeDotInCurrentWord
    ? CHANGE_CASE_WORD_CHARACTER_REGEX
    : CHANGE_CASE_WORD_CHARACTER_REGEX_WITHOUT_DOT;

  const range = document.getWordRangeAtPosition(position);
  if (!range) {
    return undefined;
  }

  let startCharacterIndex = range.start.character - 1;
  while (startCharacterIndex >= 0) {
    const charRange = new vscode.Range(
      range.start.line,
      startCharacterIndex,
      range.start.line,
      startCharacterIndex + 1
    );
    const character = document.getText(charRange);
    if (character.search(regex) === -1) {
      // no match
      break;
    }
    startCharacterIndex--;
  }

  const lineMaxColumn = document.lineAt(range.end.line).range.end.character;
  let endCharacterIndex = range.end.character;
  while (endCharacterIndex < lineMaxColumn) {
    const charRange = new vscode.Range(
      range.end.line,
      endCharacterIndex,
      range.end.line,
      endCharacterIndex + 1
    );
    const character = document.getText(charRange);
    if (character.search(regex) === -1) {
      // no match
      break;
    }
    endCharacterIndex++;
  }

  return new vscode.Range(
    range.start.line,
    startCharacterIndex + 1,
    range.end.line,
    endCharacterIndex
  );
}
