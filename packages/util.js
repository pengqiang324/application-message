/**
 * 变量序列化为驼峰命名
 * @author pengqiang
 * @date 2021/09/03 10:40
 * @param {String} varibale 序列化变量
*/
export const serialize = function(variable) {
    let arr = variable.split('-')
    let result = ''
    arr.forEach((ele,index) => {
        for(let i = 0; i < ele.length; i++) {
            let item = ele[i]
            if (index !== 0 && i == 0) {
                item = ele[i].toUpperCase()
            }
            result = result + item
        }
    })
    return result
}