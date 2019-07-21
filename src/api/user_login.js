// 引入axios
import axios from '@/utils/myaxios.js'

// 登陆
export const login = (data) => {
  return axios({
    url: 'login',
    method: 'post',
    data: data
  })
}
// 获取所有用户数据
export const getAllUserList = (params) => {
  return axios({
    url: 'users',
    params
  })
}
