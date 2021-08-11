
const version = "1.0.0"

// const METHODS = require('./post-message.js')
import METHODS, { postMessage } from './post-message'

// 定义 install 方法, 接收 Vue 作为参数。
const install = (Vue, origin="*") => {
    // 遍历注册全局组件
    window.whiteOrigin = origin
    const METHODD_NSMES = Object.keys(METHODS)
    METHODD_NSMES.forEach((name) => {
        Vue.prototype[`$zl_${name.toLocaleLowerCase()}`] = METHODS[name]
    })
}

// 判断是否全局引入文件
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export { install, postMessage } // 按需引入
export default {
    // 导出对象必须有 install，才能被 Vue.use() 方法注册
    install,
    version
}