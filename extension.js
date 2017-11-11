let ncp = require("copy-paste");
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "steal-format" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let stealFormat = vscode.commands.registerCommand('extension.stealFormat', function () {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }
        
        let clipboard = ncp.paste();
        let selectionText = editor.document.getText(editor.selection);
        let regTest = new RegExp(/(.*src)\\([\w\.]*)/g);
        let inputText = "";
        let retText = "";

        if (regTest.test(selectionText)) {
            inputText = selectionText;
        } else if (regTest.test(clipboard)) {
            inputText = clipboard;
        }

        if (inputText) {
            retText = `"${inputText.replace(/.*src/, "src").replace(/\\/g, "/")}",`;
            editor.edit(function (editBuilder) {
                editBuilder.delete(editor.selection);
            }).then(function () {
                editor.edit(function (editBuilder) {
                    editBuilder.insert(editor.selection.start, retText);
                });
            });
        } else {
            vscode.window.showErrorMessage("Please copy or select a valid path.");
        }
    });

    let stealToWebpack = vscode.commands.registerCommand('extension.stealToWebpack', function () {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }
        
        let clipboard = ncp.paste();
        let currentPath = editor.document.uri.fsPath;
        let linePathTest = /\"(src[\w\.\/]+)\"/;
        let copiedPathTest = /src[\w\.\\]+/;
        let requirePath = "";
        let retText = "";
        let requirePathArr = [];
        let lineSelectionObj = {};
        let range;
        let lineSelection;

        lineSelectionObj.line = editor.selection.active.line;
        range = new vscode.Range(lineSelectionObj.line, 0, lineSelectionObj.line, 999)
        lineSelection = editor.document.getText(range);

        if (linePathTest.test(lineSelection)) {
            let requirePathMatch = lineSelection.match(linePathTest);

            requirePath = requirePathMatch[1];
            requirePathArr = requirePath.split("\/");
            lineSelectionObj.useLineSelection = true;
            lineSelectionObj.pathStart = requirePathMatch.index;
            lineSelectionObj.pathEnd = lineSelectionObj.pathStart + requirePath.length + 2;
        } else if (copiedPathTest.test(clipboard)) {
            requirePath = clipboard.match(copiedPathTest)[0];
            requirePathArr = requirePath.split("\\");
        }

        if (requirePath && /src.*/.test(currentPath)) {
            currentPath = currentPath.match(/src.*/)[0];
            let currentPathArr = currentPath.split("\\");
            let currentPathArrLen = currentPathArr.length;
            let requirePathArrLen = requirePathArr.length;
            let requirePathPart = requirePathArr[0];
            let currentPathPart = currentPathArr[0];
            let selection = editor.selection;

            if (!/\.js$/.test(requirePathArr[requirePathArrLen - 1])) {
                requirePathArr.push(requirePathArr[requirePathArrLen - 1] + ".js");
                requirePathArrLen++;
            }
            
            for (let i = 0; i < currentPathArrLen && requirePathPart === currentPathPart; i++) {
                requirePathPart = requirePathArr[i];
                currentPathPart = currentPathArr[i];
            
                if (requirePathPart !== currentPathPart) {
                    let repeats = currentPathArrLen - i - 1;
                    let pre = repeats > 1 ? "../".repeat(repeats) : "./";
                    retText = "\"" + pre + requirePathArr.slice(i, requirePathArr.length).join("/") + "\"";
                }
            }

            if (lineSelectionObj.useLineSelection) {
                selection = new vscode.Selection(
                    lineSelectionObj.line,
                    lineSelectionObj.pathStart,
                    lineSelectionObj.line,
                    lineSelectionObj.pathEnd
                );
            }

            editor.edit(function (editBuilder) {
                if (lineSelectionObj.useLineSelection) {
                    editBuilder.delete(selection);
                }
            }).then(function () {
                editor.edit(function (editBuilder) {
                    editBuilder.insert(selection.start, retText);
                });
            });
        } else {
            vscode.window.showErrorMessage("Please copy or select a valid path.");
        }
    });

    context.subscriptions.concat([stealFormat, stealToWebpack]);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;