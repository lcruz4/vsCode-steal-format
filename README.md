## Install instructions
1. Clone https://github.com/lcruz4/vsCode-steal-format into %USERPROFILE%\\.vscode\extensions e.x. (C:\users\luiscruz\\.vscode\extensions)
2. cd into vsCode-steal-format
3. Run npm install

You may need to reload vsCode.
1. You can do this by pressing ctrl+shift+x
2. Find steal-format under installed
3. Click on it and click reload

## What it does
This extension allows you to convert steals into webpack requires. The default key binding is alt+s.
All you need to do is make sure you're on a line that contains a string of a path starting with src

![alt text](https://github.com/lcruz4/vsCode-steal-format/raw/master/readme_images/gif1.gif)

![alt text](https://github.com/lcruz4/vsCode-steal-format/raw/master/readme_images/gif2.gif)

You can also use it by copying the path of a different file to your clipboard.
In this case it will just paste the path formatted and wrapped in quotes.

![alt text](https://github.com/lcruz4/vsCode-steal-format/raw/master/readme_images/gif3.gif)

## Changelog
11/11/2017
* Added support for folder steal conversions i.e. "src/folder" => "./folder/folder.js"

11/13/2017
* Fixed bug with non .js formats
* Fixed bug when file is only 1 folder back