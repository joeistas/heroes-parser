module.exports = {
  out: "doc/",
  tsconfig: "tsconfig.doc.json",
  ignoreCompilerErrors: true,
  theme: "markdown",
  name: "heroes-parser",
  readme: "none",
  excludeNotExported: true,
  exclude: [
    "**/src/bin/**/*",
    "**/test/**/*"
  ]
}
