import { isPlainObject } from './util'

function normalizeHeaderName (headers: any, normalizedName: string): void {
  if (!headers) {
    // 如果header不存在就没什么好说的,外面会定义,直接return就行了
    return
  }
  Object.keys(headers).forEach(name => {
    // 如果headers存在我们就遍历headers
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      // 假如key值不等于Content-Type并且两者小写后是相等的,就让直接使用Content-Type命名规范
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
  // 所以我们很清楚的发现,这个函数的作用就是如果你手写了headers但是不是规范的Content-Type就不行!
}

export function processHeaders (headers: any, data: any): any {
  // 我们接受2个参数,一个headers,一个是body参数
  normalizeHeaderName(headers, 'Content-Type')
  // 因为header的大小写不敏感,所以我们要用一个辅助函数来让header属性名规范化(必须是Content-Type).

  if (isPlainObject(data)) {
    // 假如我们的参数是json
    if (headers && !headers['Content-Type']) {
      // 如果header存在并且没有设置Content-Type,就直接手动设置Content-Type

      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}