const HtmlWebpackPlugin = require('html-webpack-plugin');
// // If your plugin is using html-webpack-plugin as an optional dependency
// // you can use https://github.com/tallesl/node-safe-require instead:
// const HtmlWebpackPlugin = require('safe-require')('html-webpack-plugin');

class ReactRootElement {
  apply (compiler) {
    compiler.hooks.compilation.tap('ReactRootElement', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
        'ReactRootElement', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          // Manipulate the content
          const tag = {
            tagName: 'div',
            attributes: { id: 'root' }
          }
          data.bodyTags.unshift(tag)
          // Tell webpack to move on
          cb(null, data)
        }
      )
    })
  }
}

module.exports = ReactRootElement