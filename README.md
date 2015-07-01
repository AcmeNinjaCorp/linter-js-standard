linter-js-standard
=========================

This linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides an interface for error/warning messages from [standard](https://github.com/feross/standard) or [semistandard](https://github.com/Flet/semistandard).

![demo](https://cloud.githubusercontent.com/assets/6867996/8457085/4bd7575e-2007-11e5-9762-e3f942b78232.gif)

## Installation
Linter package must be installed in order to use this plugin. If Linter is not installed, please follow the instructions [here](https://github.com/AtomLinter/Linter).

### Plugin installation
```
$ apm install linter-js-standard
```

## Settings

### checkStyleDevDependencies (default: false)
Check code style in package.json devDependencies.

### honorStyleSettings (default: true)
Honoring `ignore` and `parser` in package.json

### style (default: standard)
You can switch between standard and semistandard styles.
If the setting `codeStyleDevDependencies` is on this setting will be **ignored**.

## License
MIT
