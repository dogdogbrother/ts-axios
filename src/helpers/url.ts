import { isDate, isPlainObject } from './util'

function encode (val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function bulidURL (url: string, params?: any) {
  // params 后面加 ? 说明了是可以选参数,是可以不传的
  // any 定义了类型,是不限制类型
  if (!params) {
    //函数不存在就没啥可处理的了,直接return 
    return url
  }

  // 定义个装string的空数组,是用于最后遍历拼接url的
  const parts: string[] = []

  Object.keys(params).forEach((key) => {
    // axios 里面的所有的参数都是对象形式进来的
    let val = params[key]
    if (val === null || typeof val === 'undefined') {
      // 如果这个参数的值为 null 或者 undefined 就不操作了,丢弃此值
      return
    }
    let values: string[] 
    // 声明一个 string 数组

    if (Array.isArray(val)) {
      // Array.isArray 是es6(还是es5的我忘了)的方法,判断这个值是不是数组
      values = val
      // 如果是的话 给key值上加个标识,为啥这么干可以翻阅下前面的需求
      key += '[]'
    } else {
      values = [val]
      // 如果不是数组就让他强行变成一位的数组,因为下面要统一遍历
    }
    values.forEach((val) => {
      if (isDate(val)) {
        // js没有办法判断一个值是不是时间,所以 isDate 函数是我们在util工具文件里面定义的,下面会写
        val = val.toISOString()
        // toISOString 是使用 ISO 标准返回 Date 对象的字符串格式
      } else if (isPlainObject(val)) {
        // isObject 同 isDate,如果是object就返回true
        val = JSON.stringify(val)
        // 把对象参数转成字符串
      }
      parts.push(`${encode(key)}=${encode(val)}`)
      // encode 也是我们写的转码函数,不过里面用了 encodeURIComponent 的全局函数
    })
  })

  let serializedParams = parts.join('&')
  // serialized 是序列化的意思,我们把这个用 & 符号连接起来
  if (serializedParams) {
    // 假如 serializedParams 的意思其实就是我们参数的数组至少有2位
    const markIndex = url.indexOf('#')
    // 我们要判断url里面有没有 # ,因为hash值后面的内容不是参数
    if (markIndex !== -1) {
      // 如果存在就把hash后面的内容截掉不要了
      url = url.slice(0, markIndex)
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
    // 最后判断,如果这个url本身没有 ? 号的话,我们就用 ? 作为参数的开始
    // 如果有的话就代表url上本身就已经有参数了,我们就用 & 连接起来新参数就行了
  }
  return url // 把我们最后处理好的url返回出去就OK了
}