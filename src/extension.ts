// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const colorRegex = /#([0-9a-fA-F]{3,8})\b|rgba?\(\d{1,3}, \d{1,3}, \d{1,3}(?:, \d?\.?\d+)?\)/g;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId === 'mss') {
        updateDecorations(editor);
    }

    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor && editor.document.languageId === 'mss') {
            updateDecorations(editor);
        }
    });

    vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.activeTextEditor;
        if (editor && event.document === editor.document && editor.document.languageId === 'mss') {
            updateDecorations(editor);
        }
    });
}

function updateDecorations(editor: vscode.TextEditor) {
    const text = editor.document.getText();
    const decorations: vscode.DecorationOptions[] = [];
    let match;

    while ((match = colorRegex.exec(text)) !== null) {
        const startPos = editor.document.positionAt(match.index);
        const endPos = editor.document.positionAt(match.index + match[0].length);

        const decoration = {
            range: new vscode.Range(startPos, endPos),
            renderOptions: {
                before: {
                    contentText: ' ',
                    backgroundColor: match[0],
                    borderRadius: '2px',
                    margin: '0 2px'
                }
            }
        };

        decorations.push(decoration);
    }

    const colorDecorationType = vscode.window.createTextEditorDecorationType({});
    editor.setDecorations(colorDecorationType, decorations);
}

vscode.workspace.onDidChangeTextDocument(event => {
    const editor = vscode.window.activeTextEditor;
    if (editor && event.document === editor.document) {
        updateDecorations(editor);
    }
});

vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
        updateDecorations(editor);
    }
});


// This method is called when your extension is deactivated
export function deactivate() {}
