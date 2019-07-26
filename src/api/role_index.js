// 引入axios
import axios from '@/utils/myaxios.js'

// 获取所有角色的数据
export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}
// 删除角色指定权限
export const delUserRight = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}
// 添加角色
export const addRoleList = (data) => {
  return axios({
    url: 'roles',
    method: 'post',
    data
  })
}
