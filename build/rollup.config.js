'use strict'

const path = require('path')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const banner = require('./banner.js')

const BUNDLE = process.env.BUNDLE === 'true'

let fileDest = 'bootstrap.js'
const external = ['popper.js']
const plugins = [
  babel({
    // Only transpile our source code
    exclude: 'node_modules/**',
    // Include only required helpers
    externalHelpersWhitelist: [
      'defineProperties',
      'createClass',
      'inheritsLoose',
      'defineProperty',
      'objectSpread'
    ]
  })
]
const globals = {
  'popper.js': 'Popper'
}

if (BUNDLE) {
  fileDest = 'bootstrap.bundle.js'
  // Remove last entry in external array to bundle Popper
  external.pop()
  delete globals['popper.js']
  plugins.push(resolve())
}

module.exports = {
  input: path.resolve(__dirname, '../js/src/index.js'),
  output: {
    banner,
    file: path.resolve(__dirname, `../dist/js/${fileDest}`),
    format: 'umd',
    globals,
    name: 'bootstrap'
  },
  external,
  plugins
}
