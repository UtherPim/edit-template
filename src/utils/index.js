/* eslint-disable eqeqeq */
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * create Websocket instance
 * @param {function} onReceive
 * @param {function} onOpen
 * @param {function} onClose
 * @param {string} addr + port
 */
export function LES(fnReceive, fnOpen, fnClose, fnError, addr) {
  this.onreceive = fnReceive || function() {}
  this.onopen = fnOpen || function() {}
  this.onclose = fnClose || function() {}
  this.onerror = fnError || function() {}

  const WS = window.WebSocket || window.MozWebSocket
  const ws = new WS(addr)

  const that = this
  ws.onmessage = function(evt) {
    that.onreceive(evt.data)
  }
  ws.onopen = that.onopen
  ws.onclose = that.onclose
  ws.onerror = that.onerror

  this.sendRequest = function(message) {
    if (ws.readyState === 0) {
      var onopen = ws.onopen
      ws.onopen = function() {
        onopen()
        ws.send(message)
      }
    } else if (ws.readyState === 1) {
      ws.send(message)
    }
  }
  this.close = function() {
    ws.close()
  }
}

/**
 * @param {Object} object
 * @returns {Object}
 */
export function resetObject(object) {
  Object.keys(object).forEach((key) => {
    object[key] = ''
  })
}

export function UnitConversion() {
  /**
   * 获取DPI
   * @returns {Array}
   */
  this.conversion_getDPI = function() {
    var arrDPI = new Array()
    if (window.screen.deviceXDPI) {
      arrDPI[0] = window.screen.deviceXDPI
      arrDPI[1] = window.screen.deviceYDPI
    } else {
      var tmpNode = document.createElement('DIV')
      tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden'
      document.body.appendChild(tmpNode)
      arrDPI[0] = parseInt(tmpNode.offsetWidth)
      arrDPI[1] = parseInt(tmpNode.offsetHeight)
      tmpNode.parentNode.removeChild(tmpNode)
    }
    return arrDPI
  }
  /**
   * px转换为mm
   * @param value
   * @returns {number}
   */
  this.pxConversionMm = function(value) {
    var inch = value / this.conversion_getDPI()[0]
    var c_value = inch * 25.4
    //      console.log(c_value);
    return c_value
  }
  /**
   * mm转换为px
   * @param value
   * @returns {number}
   */
  this.mmConversionPx = function(value) {
    var inch = value / 25.4
    var c_value = inch * this.conversion_getDPI()[0]
    //      console.log(c_value);
    return c_value
  }
}
/**
 * 生成唯一id
 */
export function generateUUID() {
  var d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now() // use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

// 获取时间"年-月-日"格式
export function getdate(now = new Date()) {
  // var now = new Date(),
  var y = now.getFullYear()
  var m = now.getMonth() + 1
  var d = now.getDate()
  return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
}
// 获取时间"时:分:秒"格式
export function gettime(now = new Date()) {
  var h = now.getHours()
  var m = now.getMinutes()
  var s = now.getSeconds()
  return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s)
}
// 获取时间"年-月-日 时:分:秒"格式
export function getDateTime(now = new Date()) {
  var y = now.getFullYear()
  var mo = now.getMonth() + 1
  var d = now.getDate()
  var h = now.getHours()
  var m = now.getMinutes()
  var s = now.getSeconds()
  return y + '-' + (mo < 10 ? '0' + mo : mo) + '-' + (d < 10 ? '0' + d : d) + ' ' + (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s)
}
// 判断浏览器内核
export function browser() {
  var u = navigator.userAgent
  return {
    trident: u.indexOf('Trident') > -1, // IE内核
    presto: u.indexOf('Presto') > -1, // opera内核
    webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
    // eslint-disable-next-line eqeqeq
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
    iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, // 是否iPad
    // eslint-disable-next-line eqeqeq
    webApp: u.indexOf('Safari') == -1, // 是否web应该程序，没有头部与底部
    weixin: u.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
    // eslint-disable-next-line eqeqeq
    qq: u.match(/\sQQ/i) == ' qq' // 是否QQ
  }
}
