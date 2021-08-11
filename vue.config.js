const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
    // 修改 src 为 examples
    pages: {
        index: {
            entry: "examples/main.js",
            template: "public/index.html",
            filename: "index.html"
        }
    },

    // 组件样式内联
    css: {
        extract: false
    },

    // 扩展 webpack 使用 package 加入编译
    chainWebpack: config => {
        // 设置别名 alias
        config.resolve.alias
            .set('@', resolve('examples'))
            .set('~', resolve('packages'))

        // 排除文件夹 eslint
        config.module
            .rule('eslint')
            .exclude.add(resolve('lib'))
            .end()
            .exclude.add(resolve('docs'))
            .end()

        // // 添加 packages 为webpack compiler
        config.module
            .rule('js')
            .include.add('/packages/')
            .end()
            .include.add('/examples/')
            .end()
            .use('babel')
            .loader('babel-loader')
            .tap((options) => {
                // 修改它的选项
                return options
            })
    }
}