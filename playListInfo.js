var showSearch = () => {
    removeClassAll('detail-area-active')
    var userBox = e('#id-div-search')
    userBox.classList.add('detail-area-active')
}

var showIlike = () => {
    removeClassAll('detail-area-active')
    var userBox = e('#id-div-ilike')
    userBox.classList.add('detail-area-active')
}

var showLyricBox = () => {
    removeClassAll('detail-area-active')
    var userBox = e('#id-div-lyrics')
    userBox.classList.add('detail-area-active')
}


// 展示我喜欢的歌单，并绑定播放事件
var getMusicInfo1 = (response) => {
    var data = JSON.parse(response)
    var musicInfo = []
    var songs = data.result.tracks
    for (var i = 0; i < songs.length; i++) {
        var song = {
            id: songs[i].id,
            name: songs[i].name,
            artist: songs[i].artists[0].name,
        }
        musicInfo.push(song)
    }
    log(musicInfo)
    return musicInfo
}

var getAndRenderIlikeList = (url) => {
    var path = url
    ajax('GET', path, null, (r) => {
        var b = isResponseOk(r)
            if (b) {
                var musicInfo = getMusicInfo1(r)
                renderMusicsLi(musicInfo, ".ilike-display-cell")
                playMusicEvent('.ilike-display-cell')
            } else {
                alert('网络异常，请稍后再试')
            }
    })
}

var getIlikeListPath = (r) => {
    var data = JSON.parse(r)
    var b = isResponseOk(r)
    if (b) {
        var ilikeId = data.playlist[0].id
        log('***', ilikeId)
        var path = `http://localhost:3000/playlist/detail?id=${ilikeId}`
        return path
    } else {
        alert('网络异常，请稍后再试')
    }
}

var renderIlikeList = () => {
    var userId = JSON.parse(localStorage.zyyMusic).id
    if (userId != '') {
        var path = `http://localhost:3000/user/playlist?uid=${userId}`
        ajax('GET', path, null, (r) => {
            var path = getIlikeListPath(r)
            getAndRenderIlikeList(path)
        })
    } else {
        alert('请先登录')
    }
}

var ilikeButtonEvent = () => {
    var ilikeButton = e('.ilike-selector-button')
    ilikeButton.addEventListener('click', event => {
        if (e('#id-div-lyrics').classList.contains('detail-area-active')) {
            clearLyric('#id-div-lyric')
        } else if (e('#id-div-search').classList.contains('detail-area-active')) {
            clearDisplayBox('.search-display-cell')
        } else {
            clearDisplayBox('.ilike-display-cell')
        }
        showIlike()
        renderIlikeList()
    })
}


// 展示搜索结果，并绑定播放事件
var getMusicInfo0 = (response) => {
    var data = JSON.parse(response)
    var musicInfo = []
    var songs = data.result.songs
    for (var i = 0; i < songs.length; i++) {
        var song = {
            id: songs[i].id,
            name: songs[i].name,
            artist: songs[i].artists[0].name,
        }
        musicInfo.push(song)
    }
    log(musicInfo)
    return musicInfo
}

var requestSearchInfo = (url) => {
    var path = url
    ajax('GET', path, null, (r) => {
        var b = isResponseOk(r)
        if (b) {
            var musicInfo = getMusicInfo0(r)
            renderMusicsLi(musicInfo, '.search-display-cell')
            playMusicEvent(".search-display-cell")
        } else {
            alert('网络异常，请稍后再试')
        }
    })
}

var searchButtonEvent = () => {
    var searchButton = e('#id-img-search')
    searchButton.addEventListener('click', (event) => {
        if (e('#id-div-lyrics').classList.contains('detail-area-active')) {
            clearLyric('#id-div-lyric')
        } else if (e('#id-div-search').classList.contains('detail-area-active')) {
            clearDisplayBox('.search-display-cell')
        } else {
            clearDisplayBox('.ilike-display-cell')
        }
        showSearch()
        var musicName = getInputValue('#id-input-search')
        if (musicName == '') {
            return
        }
        var path = `http://localhost:3000/search?keywords=${musicName}&limit=20`
        requestSearchInfo(path)
    })
}


// 给播放按钮绑定事件
var playButtonEvent = () => {
    var playButton = e('#id-button-play')
    playButton.addEventListener('click', (event) => {
        var self = event.target
        if (self.classList.contains('img-active')) {
            self.classList.remove('img-active')
            var pauseButton = e('.img-pause')
            pauseButton.classList.add('img-active')
            var userInfo = JSON.parse(localStorage.zyyMusic)
            var musicId = userInfo.musicId
            if (musicId != '') {
                var audio = e('audio')
                audio.play()
            } else if (userInfo.id == '') {
                alert('请先登录')
            } else {
                alert('你还没有播放过任何歌曲')
            }
        }
    })
}


// 给展示歌词按钮绑定事件
var lyricButtonEvent = () => {
    var lyricButton = e('#id-button-lyric')
    lyricButton.addEventListener('click', (event) => {
        if (e('#id-div-lyric').classList.contains('detail-area-active')) {
            clearLyric('#id-div-lyric')
        } else if (e('#id-div-search').classList.contains('detail-area-active')) {
            clearDisplayBox('.search-display-cell')
        } else {
            clearDisplayBox('.ilike-display-cell')
        }
        showLyricBox()
    })
}


// 给暂停按钮绑定事件
var pauseButtonEvent = () => {
    var pauseButton = e('#id-button-pause')
    pauseButton.addEventListener('click', (event) => {
        var self = event.target 
        if (self.classList.contains('img-active')) {
            self.classList.remove('img-active')
            var playButton = e('.img-play')
            playButton.classList.add('img-active')
            var audio = e('audio')
            audio.pause()
        }
    })
}


// 打开 App 显示上次播放的歌曲
var openApp = () => {
    var userInfo = JSON.parse(localStorage.zyyMusic)
    var musicId = userInfo.musicId
    log('in openApp', userInfo, musicId)
    if (musicId != '') {
        renderLyricList()
        requestMusicUrl(musicId)
        log(musicId)
    }
}


var bindEvents = () => {
    ilikeButtonEvent()
    searchButtonEvent()
    playButtonEvent()
    pauseButtonEvent()
    lyricButtonEvent()
}

var __main = () => {
    openApp()
    bindEvents()
}

__main()
