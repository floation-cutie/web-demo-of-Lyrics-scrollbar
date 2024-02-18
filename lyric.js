/**
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * 每个歌词对象的表示方式为:
 * {time: 开始时间, words: 歌词内容}
 */
function parseLrc() {
    let ret = lrc.split('\n').map((item) => {
        let parsed_time = item.slice(1, 9)
        let parsed_lrc = item.slice(10)
        return {
            time: parseTime(parsed_time),
            words: parsed_lrc
        }
    })
    return ret
}

/**
 * 将一个时间字符串解析为数字
 * 得到最后时间戳
 * @param {String} timeStr  
 */
function parseTime(timeStr) {
    let part = timeStr.split(':');
    return +part[0] * 60 + +part[1]
}

let lrcData = parseLrc();

var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.container ul'),
    container: document.querySelector('.container'),
}
/**
 * 计算出，当前时间戳下
 * lrcData数组中，应该高亮显示的歌词下标
 * 如果没有任何对应歌词显示，返回值为-1
 */
function findIndex() {
    let curTime = doms.audio.currentTime;
    for (let i = 0; i < lrcData.length; i++) {
        if (curTime < lrcData[i].time)
            return i - 1;
    }
    return lrcData.length - 1;
}

//界面
function createLrcElements() {
    let frag = document.createDocumentFragment();
    for (let i = 0; i < lrcData.length; i++) {
        let li = document.createElement('li');
        li.textContent = lrcData[i].words;
        // doms.ul.appendChild(li); //改动了dom树，优化方式为批量更新
        frag.appendChild(li);
    }
    doms.ul.appendChild(frag);
}
createLrcElements();

let containerHeight = doms.container.clientHeight;
let liHeight = doms.ul.children[0].clientHeight;
//最大偏移量
let maxOffset = doms.ul.clientHeight - containerHeight;
/**
 * 设置ul元素偏移量
 */
function setOffset() {
    var index = findIndex();
    let h1 = index * liHeight + liHeight / 2;
    let h2 = containerHeight / 2;
    let offset = h1 - h2;
    // 分类情形
    if (offset < 0) offset = 0;

    if (offset > maxOffset) offset = maxOffset;
    let li = doms.ul.querySelector('.active');
    if (li) {
        li.classList.remove('active');
    }
    doms.ul.style.transform = `translateY(-${offset}px)`;
    if (index > -1)
        doms.ul.children[index].classList.add('active');

}
//可以先进行index的显示高亮比较，然后判断是否执行setOffset
doms.audio.addEventListener('timeupdate', setOffset);