import Vue from 'vue'
import {
    APP,
    GETTOP,
    MASK as mask,
    PAGE as page,
    MODAL as modal,
    NOTIFY as notify,
    MESSAGE as MSG,
    LOGONOUT as logonOut,
    REPLACE as replace,
    FORWARD as forward,
    GO as go,
    BACK as back,
    PREVIEWIMAGE as previewImage,
    SETHEIGHT
} from './observe-types'
import { serialize } from './util'
/**
 * 推送消息
 * @Author pengqiang
 * @Date 2021/07/12 15:34
 * @param {String} type 推送消息类型
 * @param {Object} data 推送消息数据
 * @param {String} origin 推送目标网址
 */
const postMessage = ({ type, data={}, origin='*'}) => {
    if (!window.parent) return
    window.parent.postMessage({
        type,
        data,
    }, window.whiteOrigin || origin)
}

/**
 * 遮罩层
 * @author pengqiang
 * @date 2021/07/27 10:27
 * @param {Boolean} val 显示/隐藏遮罩层
 * @param {String} tagName 选择器标签名
 */
const MASK = (val, tagName='.el-dialog__wrapper') => {
    if (val) {
        Vue.nextTick(() => {
            postMessage({ type: GETTOP })
            window.addEventListener(MSG, (event) => {
            if (event.origin !== window.whiteOrigin) return
            const dialog = document.querySelector(tagName).firstChild
            const { scrollTop, clientHeight, offsetTop } = event.data
            const msgOffsetTop = (clientHeight/2) - (dialog.offsetHeight/2)
            const pageScrollTop  = scrollTop - offsetTop
            const top = (msgOffsetTop + pageScrollTop) - 100
            dialog.style.cssText = `margin-top: 0;top:${ top <= 0 ? 0 : top }px`
            }, { once: true })
        })
    }
    postMessage({
        type: mask,
        data: {
            showMask: val
        }
    })
}

/**
 * 消息提醒
 * @author pengqiang
 * @date 2021/07/27 10:27
 * @param {String} type 消息提醒类型，存在四个值*(success, info, warning, fail)
 * @param {String} message 消息文本
 */
const MESSAGE = ({ type, message }) => {
    postMessage({
        type: MSG,
        data: {
            type,
            message,
        }
    })
}

/**
 * 不同状态 用来显示「成功、警告、消息、错误」类的操作反馈。
 * @author pengqiang
 * @date 2021/08/11 09:58
 */ 
const MESSAGE_TYPE = ['success', 'info', 'warning', 'loading', 'error', 'warn']
MESSAGE_TYPE.forEach((type) => {
    MESSAGE[type] = (message) => {
        postMessage({
            type: MSG,
            data: {
                type,
                message,
            }
        })
    }
})

/**
 * 退出登录
 * @author pengqiang
 * @date 2021/07/27 10:27
 * @param {String} message 退出登录文本提示语
 */
 const LOGONOUT = ({ message }) => {
    postMessage({
        type: logonOut,
        data: {
            message
        }
    })
}

/**
 * 路由跳转
 * @author pengqiang
 * @date 2021/07/27 10:28
 * @param {String | Object} path 路由地址或路由对象
 * @param {Boolean} replace 公用组件是否开启单个 multitab 模式
 */
 const PAGE = (path, replace=false) => {
    postMessage({
        type: page,
        data: {
            path,
            replace
        }
    })
}

/**
 * 路由跳转替换
 * @author pengqiang
 * @date 2021/09/01 11:32
 * @param {String} path 路由地址
 */
 const REPLACE = (path) => {
    postMessage({
        type: replace,
        data: {
            path
        }
    })
}

/**
 * 路由前进
 * @author pengqiang
 * @date 2021/09/01 11:32
 */
 const FORWARD = () => {
    postMessage({
        type: forward,
        data: {}
    })
}

/**
 * 路由向前或后退多少步
 * @author pengqiang
 * @date 2021/09/01 11:32
 * @param {n} 向前或后退多少步
 */
 const GO = (n=-1) => {
    postMessage({
        type: go,
        data: {
            n
        }
    })
}

/**
 * 路由后退
 * @author pengqiang
 * @date 2021/09/01 11:32
 */
 const BACk = () => {
    postMessage({
        type: back,
        data: {}
    })
}


/**
 * Modal 模态对话框
 * @author pengqiang
 * @date 2021/07/27 10:28
 * @param {String} title 模态标题
 * @param {Stirng} content 模态内容
 * @param {Object} options { confirmButtonText, cancelButtonText }
 */
 const CONFIRM = (content, title, { confirmButtonText, cancelButtonText }) => {
    postMessage({
        type: modal,
        data: {
            title,
            content,
            confirmButtonText,
            cancelButtonText
        }
    })
    return new Promise((resolve, reject) => {
        window.resolve = resolve
        window.reject = reject
        window.addEventListener(MSG, messageCallback, { once: true })
    })
}

const messageCallback = function(event) {
    if (event.origin !== window.whiteOrigin) return
    const { code } = event.data
    if (code === 200) {
        window.resolve()
    } else {
        window.reject('cancel')
    }
    setTimeout(() => { 
        window.resolve = null
        window.reject = null 
    }, 1)
}

/**
 * Notification 通知
 * @author pengqiang
 * @date 2021/07/27 10:36
 * @param {String} type 通知图标类型,存在四个值*(success, info, fail, warning)
 * @param {String} title 通知标题
 * @param {Stirng} message 通知描述
 * @param {String} position 通知展示位置
 */
 const NOTIFY = ({ type, title, message, position='topRight' }) => {
    postMessage({
        type: notify,
        data: {
            type,
            message: title,
            description: message,
            placement: serialize(position) // 驼峰命名序列化
        }
    })
}

/**
 * 不同状态 用来显示「成功、警告、消息、错误」类的 Notification 通知反馈。
 * @author pengqiang
 * @date 2021/09/03 10:21
 * @param {String} type 通知图标类型,存在四个值*(success, info, fail, warning)
 * @param {String} title 通知标题
 * @param {Stirng} message 通知描述
 * @param {String} position 通知展示位置
 */ 
 const NOTIFY_TYPE = ['success', 'info', 'warning', 'error']
 NOTIFY_TYPE.forEach((type) => {
    NOTIFY[type] = ({ title, message, position='topRight' } ) => {
        postMessage({
            type: notify,
            data: {
                type,
                message: title,
                description: message,
                placement: serialize(position) // 驼峰命名序列化
            }
        })
    }
})

/**
 * 图片预览
 * @author pengqiang
 * @date 2021/09/03 15:29
 * @param {String} image 预览图片地址
 */
 const PREVIEW = (image) => {
    postMessage({
        type: previewImage,
        data: {
            image
        }
    })
}

/**
 * 重新计算应用高度
 * @author pengqiang
 * @date 2021/08/27 14:43
 * @param {String} 应用id
*/
const REFRESH = (tagName=APP) => {
    Vue.nextTick(() => {
        const $tar = document.getElementById(tagName)
        const $height = window.getComputedStyle($tar).getPropertyValue('height')
        postMessage({ type: SETHEIGHT, data: { height: $height } })
    })
}

export default { 
    MASK, 
    MESSAGE, 
    LOGONOUT, 
    PAGE, 
    CONFIRM, 
    NOTIFY,
    REFRESH,
    REPLACE,
    GO,
    BACk,
    FORWARD,
    PREVIEW
}

export { postMessage } // 按需引入