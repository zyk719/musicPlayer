//zyy 2018-5-10

// localStorage 数据结构
// var zyyMusic = {
//     // 用户 id 获取数据需要
//     id: '254744287',
//     // 用户名称 加载登陆框使用
//     name: '默默丶箫笙',
//     // 头像图片 Url
//     imageUrl: "http://p3.music.126.net/MEhSJ210tsuOaNNKjnznfg==/1395280258923307.jpg",
//     // 现在 播放歌曲的Url
//     musicId: '',
// }

// 登陆界面
var showSignin = () => {
    removeClassAll('user-box-active')
    var element = e('.user-box-1')
    log('in showSignin')
    element.classList.add('user-box-active')
}

// 输入界面
var showSumbit = () => {
    removeClassAll('user-box-active')
    var submitBox = e('.user-box-2')
    submitBox.classList.add('user-box-active')
}

// 用户界面
var showUser = () => {
    removeClassAll('user-box-active')
    var userBox = e('.user-box-0')
    userBox.classList.add('user-box-active')
}

// 注册按钮 绑定事件
var signupEvent = () => {
    var button = e('#id-button-signup')
    button.addEventListener('click', () => {
        log('click')
        alert('注册功能尚未开放')
    })
}

// 登陆按钮 绑定事件
var signinEvent = () => {
    var signinButton = e('#id-button-signin')
    signinButton.addEventListener('click', (event) => {
    showSumbit()
    submitEvent()
    })
}

// 提交按钮 绑定事件
var getInput = () => {
    var account = getInputValue('#id-input-phoneNum')
    var password = getInputValue('#id-input-password')
    var l = [account, password]
    return l
}

var submitEvent = () => {
    var submitButton = e('#id-button-submit')
    submitButton.addEventListener('click', (event) => {
        var data = getInput()
        userLogin(data)
    })
}

// 注销按钮绑定事件
var exitEvent = () => {
    var exitButton = e('#id-button-exit')
    exitButton.addEventListener('click', () => {
        localStorage.removeItem('zyyMusic')
        var zyyMusic = {
            id: '',
            name: '',
            imageUrl: '',
            musicId: '',
        }
        localStorage.zyyMusic = JSON.stringify(zyyMusic)
        showSignin()
        signinEvent()
        signupEvent()
    })
}

// 获取登陆请求 path
var getPath = (userInfoArr) => {
    var  l = userInfoArr
    var phoneNum = l[0]
    var password = l[1]
    var path = `http://localhost:3000/login/cellphone?phone=${phoneNum}&password=${password}`
    return path
}

var saveAndRenderUserInfo = (r) => {
    var data = JSON.parse(r)
    if (data.code == 200) {
        var localData = JSON.parse(localStorage.zyyMusic)
        localData.id = data.account.id
        localData.name = data.profile.nickname
        localData.imageUrl = data.profile.avatarUrl
        localStorage.zyyMusic = JSON.stringify(localData)
        showUser()
        renderUserInfo()
    } else {
        alert('账号或密码错误')
    }

}

var userLogin = (userInfoArr) => {
    var l = userInfoArr
    var path = getPath(l)
    log(path)
    ajax('GET', path, null, (r) => {
        saveAndRenderUserInfo(r)
    })
    exitEvent()
}

// 向网页中插入 '用户信息'：用户名 头像 id
var inputUserInfo = (uesrObj) => {
    var userInfo = uesrObj
    e('#id-image-user').src = userInfo.imageUrl
    e('#id-span-uesrName').innerText = userInfo.name
}

// 根据 AJAX 返回值，渲染网页
var renderUserInfo = () => {
    var data = JSON.parse(localStorage.zyyMusic)
    inputUserInfo(data)
}

// 载入页面 判断 uesrInfo 框显示的内容
var existRightCookie = () => {
    if (localStorage.zyyMusic != undefined) {
        var data = JSON.parse(localStorage.zyyMusic)
        var id = data.id
        var result = !(id === '')
        return result
    } else {
        var zyyMusic = {
            id: '',
            name: '',
            imageUrl: '',
            musicId: '',
        }
        localStorage.zyyMusic = JSON.stringify(zyyMusic)
    }
}

// 加载页面：
// 判断 localStorage 中 id 是否存在
// 存在 渲染登陆信息框
// 不存在 渲染登陆界面
var selectDiv = () => {
    var isCookieOk = existRightCookie()
    log('isCookieOk', isCookieOk)
    if (isCookieOk) {
        log('in selectDiv if')
        showUser()
        renderUserInfo()
        exitEvent()
    } else {
        showSignin()
        signinEvent()
        signupEvent()
    }
}

var __main = () => {
    selectDiv()
}

__main()
