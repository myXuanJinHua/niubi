// 引入axios
import axios from '@/utils/myaxios.js'

// 获取商品列表
export const getAllGoodsList = (params) => {
  return axios({
    url: 'goods',
    method: 'get',
    params
  })
}
// 获取分类数据
export const getCatList = (params) => {
  return axios({
    url: 'categories',
    method: 'get',
    params
  })
}
// 添加商品
export const addGoods = (data) => {
  return axios({
    url: 'goods',
    method: 'post',
    data
  })
}
