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

var es = function(selector) {
    var elements = document.querySelectorAll(selector)
    if (elements.length == 0) {
        var s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        // alert(s)
        log(s)
    } else {
        return elements
    }
}

var appendHtml = function(element, html) {
    element.insertAdjacentHTML('beforeend', html)
}

var bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

var removeClassAll = function(className) {
    var selector = '.' + className
    var elements = es(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        log('classname', className, e)
        e.classList.remove(className)
    }
}

// 封装一个 AJAX 函数；
var ajax = function(method, path, data, callback) {
    var r = new XMLHttpRequest()
    r.open(method, path, true)
    // r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = function() {
        if (r.readyState == 4) {
            callback(r.response)
        }
    }
    r.send(data)
}

var getInputValue = (selector) => {
    var input = e(selector)
    var value = input.value
    input.value = ''
    return value
}

var xToN = (str, n) => {
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    var s = str.slice(0, 1)
    if (str.length > n && letters.includes(s)) {
        str = str.slice(0, 12) + '..'
    } else if (str.length > n) {
        str = str.slice(0, n) + '..'
    }
    return str
}

var templateLi = (musicObj) => {
    var musicInfo = musicObj
    musicInfo.name = xToN(musicInfo.name, 6)
    musicInfo.artist = xToN(musicInfo.artist, 3)
    var t = `
        <li class="li-cell" >
            <span data-id=${musicInfo.id} class="music-name music-play">${musicInfo.name}</span>
            <span class="music-singer">${musicInfo.artist}</span>
        </li>
    `
    return t
}

var templateSpan = (musicObj) => {
    var musicInfo = musicObj
    var t = `
            <span data-id=${musicInfo.time} class="lyric-list ${musicInfo.str}">${musicInfo.lrc}</span>
    `
    return t
}

var renderMusicsLi = (musicArr, selector) => {
    var musicInfo = musicArr
    for (var i = 0; i < musicInfo.length; i++) {
        var li = templateLi(musicInfo[i])
        var insertPlace = e(selector)
        appendHtml(insertPlace, li)
    }
}

var renderMusicLyric = (musicArr, selector) => {
    var musicInfo = musicArr
    for (var i = 0; i < musicInfo.length; i++) {
        var span = templateSpan(musicInfo[i])
        var insertPlace = e(selector)
        appendHtml(insertPlace, span)
    }
}

var isResponseOk = (response) => {
    var data = JSON.parse(response)
    log(data)
    return (data.code === 200)
}

var clearDisplayBox = (selector) => {
    var lis = es('.li-cell')
    var displayBox = e(selector)
    if (lis != undefined) {
        for (var i = 0; i < lis.length; i++) {
            displayBox.removeChild(lis[i])
        }
    }
}

var clearLyric = (selector) => {
    var lis = es('.lyric-list')
    var displayBox = e(selector)
    if (lis != undefined) {
        for (var i = 0; i < lis.length; i++) {
            displayBox.removeChild(lis[i])
        }
    }
}

// 展示歌词
var showLyric = (Arr, n) => {
    var lyricArr = Arr
    var lyrics = []
    var len = ((n + 5) <= (lyricArr.length)) ? (n + 6) : (lyricArr.length)
    for (var i = (n - 5); i < len; i++) {
        if (i < 0) {
            for (var i = 0; i < 11; i++) {
                if (i == n) {
                    var lyric = {
                        time: lyricArr[i][0],
                        lrc: lyricArr[i][1],
                        str: 'color-active',
                    }
                    lyrics.push(lyric)
                } else if (i == 0 && i < n) {
                    var lyric = {
                        time: lyricArr[i][0],
                        lrc: lyricArr[i][1],
                        str: 'color-active1',
                    }
                    lyrics.push(lyric)
                } else if (i == 1 && i < n) {
                    var lyric = {
                        time: lyricArr[i][0],
                        lrc: lyricArr[i][1],
                        str: 'color-active2',
                    }
                    lyrics.push(lyric)
                }else {
                    var lyric = {
                        time: lyricArr[i][0],
                        lrc: lyricArr[i][1],
                        str: '',
                    }
                    lyrics.push(lyric)
                }
            }
        } else if (i == n) {
            var lyric = {
                time: lyricArr[i][0],
                lrc: lyricArr[i][1],
                str: 'color-active',
            }
            lyrics.push(lyric)
        } else if (i == n - 5) {
            var lyric = {
                time: lyricArr[i][0],
                lrc: lyricArr[i][1],
                str: 'color-active1',
            }
            lyrics.push(lyric)
        } else if (i == n - 4) {
            var lyric = {
                time: lyricArr[i][0],
                lrc: lyricArr[i][1],
                str: 'color-active2',
            }
            lyrics.push(lyric)
        } else {
            var lyric = {
                time: lyricArr[i][0],
                lrc: lyricArr[i][1],
                str: '',
            }
            lyrics.push(lyric)
        }
    }
    log(lyrics)
    clearLyric('#id-div-lyric')
    renderMusicLyric(lyrics, '#id-div-lyric')
}

var minToSec = (str) => {
    var strTime = str
    var secmin = strTime.slice(0, 5)
    var secs = Number(secmin.split(':')[0]) * 60 + Number(secmin.split(':')[1])
    return secs
}

var showOneLyric = (Arr) => {
    var lyricArr = Arr
    var audio = e('.audio-tags')
    audio.ontimeupdate = () => {
        for (var i = 0; i < lyricArr.length; i++) {
            if (minToSec(lyricArr[i][0]) == Math.floor(audio.currentTime)) {
                showLyric(lyricArr, i)
            }
        }
    }
}

var lyricToArr = (r) => {
    var response = r
    var data = JSON.parse(response)
    log(data)
    var lyric = data.lrc.lyric
    var lyricArr = lyric.split('\n').slice(0, -1)
    var lyricArr1 = lyricArr.map(t => {
        var time = [t.split(']')[0].slice(1), t.split(']')[1]]
        return time
    })
    return  lyricArr1
}

var renderLyricList = () => {
    var musicId = JSON.parse(localStorage.zyyMusic).musicId
    var path = `http://localhost:3000/lyric?id=${musicId}`
    ajax('GET', path, null, (r) => {
        var lyricArr = lyricToArr(r)
        log('++__', lyricArr)
        showOneLyric(lyricArr)
    })
}

// 播放歌曲
var playMusic = (r, id) => {
    var data = JSON.parse(r)
    var url = data.data[0].url
    if (url) {
        log(url)
        var audio = e('audio')
        audio.src = url
    } else {
        alert('此曲目暂时下架')
    }
}

var requestMusicUrl = (id) => {
    var musicId = id
    var path = `http://localhost:3000/music/url?id=${musicId}`
    ajax('GET', path, null, (r) => {
        playMusic(r, musicId)
    })
}

var playMusicEvent = (selector) => {
    var displayBox = e(selector)
    displayBox.addEventListener('click', (event) => {

        var playButton = e('#id-button-play')
        if (playButton.classList.contains('img-active')) {
            var pauseButton = e('#id-button-pause')
            playButton.classList.remove('img-active')
            pauseButton.classList.add('img-active')
        }


        showLyricBox()
        clearLyric('#id-div-lyric')
        var self = event.target
        if (self.classList.contains('music-play')) {
            var musicId = self.dataset.id
            var data = JSON.parse(localStorage.zyyMusic)
            data.musicId = musicId
            localStorage.zyyMusic = JSON.stringify(data)
            renderLyricList()
            requestMusicUrl(musicId)
            var audio = e('audio')
            audio.addEventListener('canplay', () => {
                audio.play()
            })
        }
    })
}
