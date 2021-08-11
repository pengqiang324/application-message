/**
 * 推送消息
 * @Author pengqiang
 * @Date 2021/07/12 15:34
 * @params {String} type 推送消息类型
 * @params {Object} data 推送消息数据
 * @params {String} origin 推送目标网址
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
 * @params {Boolean} val 显示/隐藏遮罩层
 */
const MASK = (val) => {
    postMessage({
        type: 'mask',
        data: {
            showMask: val
        }
    })
}

/**
 * 消息提醒
 * @author pengqiang
 * @date 2021/07/27 10:27
 * @params {String} type 消息提醒类型，存在四个值*(success, info, warning, fail)
 * @params {String} message 消息文本
 */
const MESSAGE = ({ type, message }) => {
    postMessage({
        type: 'message',
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
const MESSAGE_TYPE = ['success', 'info', 'warning', 'fail']
MESSAGE_TYPE.forEach((type) => {
    MESSAGE[type] = (message) => {
        postMessage({
            type: 'message',
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
        type: 'logonOut',
        data: {
            message
        }
    })
}

/**
 * 路由跳转
 * @author pengqiang
 * @date 2021/07/27 10:28
 * @params {String} path 路由地址
 */
 const PAGE = (path) => {
    postMessage({
        type: 'page',
        data: {
            path
        }
    })
}

/**
 * Modal 模态对话框
 * @author pengqiang
 * @date 2021/07/27 10:28
 * @params {String} title 模态标题
 * @params {Stirng} content 模态内容
 * @params {Object} options { confirmButtonText, cancelButtonText }
 */
 const CONFIRM = (content, title, { confirmButtonText, cancelButtonText }) => {
    postMessage({
        type: 'modal',
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
        window.addEventListener('message', messageCallback, { once: true })
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
 * @params {String} type 通知图标类型,存在四个值*(success, info, fail, warning)
 * @params {String} message 通知标题
 * @params {Stirng} description 通知描述
 */
 const NOTIFY = ({ type, message, description }) => {
    postMessage({
        type: 'notification',
        data: {
            type,
            message,
            description
        }
    })
}

export default { 
    MASK, 
    MESSAGE, 
    LOGONOUT, 
    PAGE, 
    CONFIRM, 
    NOTIFY
}

export { postMessage } // 按需引入