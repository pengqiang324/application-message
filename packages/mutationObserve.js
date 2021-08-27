import { postMessage } from './post-message'
import { SETHEIGHT } from './observe-types'
window.onload = function() {
    var recordHeight = 0
    var $tar = document.getElementById('app');
    var MutationObserver = window.MutationObserver || window.webkitMutationObserver || window.MozMutationObserver;
    var mutationObserver = new MutationObserver(function () {
        let height = window.getComputedStyle($tar).getPropertyValue('height');
        if (height === recordHeight) return;
        recordHeight = height
        postMessage({type: SETHEIGHT, data: { height }})
    })
    mutationObserver.observe($tar, {
        childList: true, // 子元素的变动
        characterData: true, // 节点内容或节点文本的变动
        subtree: true, // 是否将观察器应用于该节点的所有后代节点
    })
}