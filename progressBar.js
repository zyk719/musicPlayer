// 进读条实现
    // 通过修改进度条 width 展示效果
    // 进度条 width 通过 currentTime / duration * 总长度 获得
    // setInterval 每 10ms 改变一次 width 长度，帧率 100

// 进度条拖动事件
    // offsetX 是触发点相对于 btn 起始坐标的距离。
    // 记录点击时的 offsetX
    // 拖动后求得 offsetX 差值 ，
    // 在 x轴 移动 btn offsetX 差值,
        // 获得 progressBar长度px，加上偏移像素px，除以 100px
        // 获取 改变后的歌曲进度
        // 设置 currentTime
        // 进度条移动，btn 移动
        // setInterval 每 10ms 改变一次 width 长度，帧率 100
var log = console.log.bind(console)

var e = function(selector) {
    var element = document.querySelector(selector)
    if (element == null) {
        var s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return element
    }
}

var getRatio = () => {
    var audioTag = e('audio')
    var musicDuration = audioTag.duration
    var musicPlayTime = audioTag.currentTime
    var ratio = musicPlayTime / musicDuration
    return ratio
}

var changeProgressContent = () => {
    var ratio = getRatio()
    var progressContent = e('.progress-content')
    progressContent.style.width = `${ratio * 110}px`
}

var progressBtnEvent = () => {
    var progressBtn = e('.progress-btn')
    var audio = e('audio')
    progressBtn.addEventListener('mousedown', event => {
        audio.pause()
        var x = event.offsetX
        progressBtn.addEventListener('mouseout', event => {
            audio.play()
            $('.progress-btn').unbind('mousemove')
        })

        $('.progress-btn').bind('mousemove', event => {
            var progressBar = e('.progress-content')
            var barWidth = progressBar.style.width
            var barWidthNum = Number(barWidth.slice(0, -2))
            var deltaX = event.offsetX - x
            var ratio = (barWidthNum + deltaX) / 110
            audio.currentTime = audio.duration * ratio
        })
    })
    progressBtn.addEventListener('mouseup', event => {
        audio.play()
        $('.progress-btn').unbind('mousemove')
    })
}

var jumpEvent = () => {
    var progressBar = e('.progress-bar')
    var audio = e('audio')
    progressBar.addEventListener('click', event => {
        // 事件委托
        // 如果点的不是 btn 才触发事件
        // 不然会跟拖动事件冲突
        if (!event.target.classList.contains('progress-btn')) {
            var ratio = event.offsetX / 110
            audio.currentTime = audio.duration * ratio
            audio.play()
        }
    })
}

var playBox = () => {
    setInterval(() => {
        changeProgressContent()
        log('setInterval')
    }, 10)
    progressBtnEvent()
    jumpEvent()
}

playBox()
