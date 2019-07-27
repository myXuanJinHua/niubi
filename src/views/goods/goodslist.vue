<template>
  <div class="goods">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框和添加用户按钮 -->
    <div style="margin: 15px 0;">
      <el-input
        placeholder="请输入内容"
        v-model="goodsobj.query"
        class="input-with-select"
        @keyup.enter.native="init"
        style="width:300px"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" style="margin-left: 15px" @click="addGoods">添加商品</el-button>
    </div>
    <!-- 商品列表 -->
    <el-table :data="goodList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" ></el-table-column>
      <el-table-column prop="goods_state" label="商品状态" ></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" ></el-table-column>
      <el-table-column label="创建时间" >
          <template slot-scope="scope">
              {{scope.row.add_time | time}}
          </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
            <el-button type="primary" icon="el-icon-edit" ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top-end">
            <el-button type="primary" icon="el-icon-d-caret"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
            <el-button type="primary" icon="el-icon-delete" @click="delGoods(scope)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsobj.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="goodsobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { getAllGoodsList } from '@/api/goods_index.js'
export default {
  data () {
    return {
      // 商品总数
      total: 0,
      // 商品列表数据数组
      goodList: [],
      // 初始化商品列表数据的参数
      goodsobj: {
        //   搜索框的关键字
        query: '',
        // 当前页
        pagenum: 1,
        // 每页的多少条
        pagesize: 10
      }
    }
  },
  methods: {
    // 添加商品
    addGoods () {
      this.$router.push({ name: 'addgoods' })
    },
    //   分页的两个函数
    handleSizeChange (val) {
    //   console.log(`每页 ${val} 条`)
      this.goodsobj.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
    //   console.log(`当前页: ${val}`)
      this.goodsobj.pagenum = val
      this.init()
    },
    //   商品的删除
    delGoods (scope) {
      console.log(scope)
    },
    //   这是获取初始化商品列表的数据
    init () {
      getAllGoodsList(this.goodsobj)
        .then(res => {
        //   console.log(res)
          if (res.data.meta.status === 200) {
            this.total = res.data.data.total
            this.goodsobj.pagenum = res.data.data.pagenum - 0
            this.goodList = res.data.data.goods
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  filters: {
    //   毫秒的时间戳的过滤  需要data*1000
    time (data) {
      let time = new Date(data * 1000)
      return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
