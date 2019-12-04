import { AxiosRequestConfig } from './types'
import xhr from './xhr'
import { bulidURL } from './helpers/url'
import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/headers'

function axios(config: AxiosRequestConfig): void {
  // 我们在使用axios是的参数是 config,我们先要处理一下
  processConfig(config)
  xhr(config)
}

function processConfig (config: AxiosRequestConfig): void {
  // 把参数处理一下后覆盖掉参数的url,处理了什么呢? 
  // 这个函数只是做了个简单的中转为什么还要单独起一个函数呢,我猜想后面会有别的操作.
  config.url = transformUrl(config)
  config.headers = transformHeaders(config) 
  // 我们处理header的动作一定要是在处理body的动作前面,因为body处理函数就把json变成字符串.
  config.data = transformRequestData(config)
}

function transformUrl (config: AxiosRequestConfig): string {
  const { url, params } = config 
  // 我们通过结构赋值拿到url和参数对象,通过 bulidURL 函数对url的拼接得到新的url
  return bulidURL(url, params)
}

function transformRequestData (config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

function transformHeaders (config: AxiosRequestConfig) {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

export default axios