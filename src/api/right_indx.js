// 引入axios
import axios from '@/utils/myaxios.js'
// 获取所有角色的全部权限
export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
// 角色授权
export const grantRight = (roleId, rids) => {
  // console.log(roleId, rids)
  return axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids }
  })
}
// 获取左侧菜单项
export const leftMenuList = () => {
  return axios({
    url: 'menus'
  })
}
