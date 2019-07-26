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
// 添加用户数据
export const addUserList = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}
// 根据ID删除用户数据
export const delUser = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}
// 发送编辑用户数据
export const editUser = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}
// 根据Id修改用户状态
export const changeState = (uid, type) => {
  return axios({
    url: `users/${uid}/state/${type}`,
    method: 'put'
  })
}
// 发送分配用户角色
export const setUserRole = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data
  })
}
