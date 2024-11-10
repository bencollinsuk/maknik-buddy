"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const colorRegex = /#([0-9a-fA-F]{3,8})\b|rgba?\(\d{1,3}, \d{1,3}, \d{1,3}(?:, \d?\.?\d+)?\)/g;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
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
function updateDecorations(editor) {
    const text = editor.document.getText();
    const decorations = [];
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
function deactivate() { }
//# sourceMappingURL=extension.js.map