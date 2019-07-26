<template>
  <div class="right">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表 -->
    <el-table
      :data="rightTableData"
      style="width: 100%"
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column property="authName" label="权限名称" ></el-table-column>
      <el-table-column property="path" label="路径" ></el-table-column>
      <el-table-column  label="层级">
        <template slot-scope="scope">
         {{scope.row.level | levelForm}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllRightList } from '@/api/right_indx.js'
export default {
  data () {
    return {
      rightTableData: []
    }
  },
  methods: {

  },
  filters: {
    levelForm (data) {
      if (data === '0') {
        return '一级'
      } else if (data === '1') {
        return '二级'
      } else if (data === '2') {
        return '三级'
      } else {
        return ''
      }
    }
  },
  mounted () {
    getAllRightList('list')
      .then((res) => {
        // console.log(res)
        this.rightTableData = res.data.data
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>
<style lang="less" scoped>
</style>
