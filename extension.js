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

    context.subscriptions.push(stealFormat);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;