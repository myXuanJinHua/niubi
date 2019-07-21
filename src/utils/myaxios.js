// 此文件封装axios所有配置
import axios from 'axios'

// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 添加一个Authorization的键值
  let token = localStorage.getItem('itcast_token')
  if (token) {
    config.headers['Authorization'] = token
    // console.log(config)
  }
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
export default axios
