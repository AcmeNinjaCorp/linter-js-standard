// Dependencies
var CompositeDisposable = require('atom').CompositeDisposable
var selectStyle = require('./utils/select-style')
var styleSettings = require('./utils/style-settings')

module.exports = {
  config: {
    style: {
      type: 'string',
      default: 'standard',
      enum: ['standard', 'semi-standard', 'happiness']
    },
    checkStyleDevDependencies: {
      type: 'boolean',
      description: 'Check code style on package.json devDependencies',
      default: false
    },
    honorStyleSettings: {
      type: 'boolean',
      description: 'Honor code style settings on package.json',
      default: false
    },
    showEslintRules: {
      type: 'boolean',
      description: 'Show the eslint rule name on error/warning\'s message',
      default: false
    }
  },
  cache: new Map(),
  subscriptions: {},
  scope: ['source.js', 'source.js.jsx', 'source.js.jquery'],
  activate: function () {
    var self = this
    var config = atom.config.get('linter-js-standard')
    this.cache.set('config', config)

    // On startup get active pane
    // check if it's a text editor
    // if it is cache it's settings
    var paneItem = atom.workspace.getActivePaneItem()
    if (this.__checkIfTextEditor(paneItem)) {
      this.__cacheTextEditor(config, paneItem)
    }

    // Create some subscriptions
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(function (paneItem) {
      // Check if the pane is a file
      if (!self.__checkIfTextEditor(paneItem)) {
        return
      }

      // Check if this file is inside our grammar scope
      var grammar = paneItem.getGrammar()
      if (self.scope.indexOf(grammar.scopeName) < 0) {
        return
      }

      // Get config
      var config = self.cache.get('config')

      // Cache active pane
      self.__cacheTextEditor(config, paneItem)
    }))

    // on package settings change
    this.subscriptions.add(atom.config.observe('linter-js-standard', function (config) {
      // Cache config
      self.cache.set('config', config)
    }))
  },

  deactivate: function () {
    this.subscriptions.dispose()
  },

  __cacheTextEditor: function (config, textEditor) {
    var filePath = textEditor.getPath()
    var styleObj = selectStyle(config, filePath)
    var args = ['--verbose']

    // If setting honorStyleSettings is checked
    // and there is a valid linter
    if (config.honorStyleSettings && styleObj.name !== 'no-style') {
      // This function may modify the following variables:
      // - args
      // - styleObj
      styleSettings.call({ args: args, styleObj: styleObj }, filePath)
    }

    // Cache style settings and args of some file
    this.cache.set('text-editor', { styleObj: styleObj, args: args })
  },

  __checkIfTextEditor: function (paneItem) {
    return (paneItem && typeof paneItem.getGrammar === 'function' && typeof paneItem.getPath === 'function')
  },

  provideLinter: require('./linter-js-standard')
}
