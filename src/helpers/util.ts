const toString = Object.prototype.toString

export function isDate (val: any): val is Date {
  return toString.call(val) === '[object Date]'
  // 小技巧嗷,判断是不是时间格式的
}

// export function isObject (val: any): val is Object {
//   return val !== null && typeof val === 'object'
//   // 因为null本身也是object,所以要联合判断一下
// }

export function isPlainObject (val: any): val is Object {
  return toString.call(val) === '[object Object]'
}