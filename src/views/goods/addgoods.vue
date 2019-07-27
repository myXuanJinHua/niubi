<template>
  <div class="goods">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :active="active-0" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <!-- 左边的标签页 -->
    <el-form :model="addForm" :rules="rules" ref="addForm" class="demo-ruleForm">
      <el-tabs v-model="active" :tab-position="'left'">
        <!-- 基本信息的表单 -->
        <el-tab-pane label="基本信息" name="0">
          <el-form-item prop="goods_name" label="商品名称">
            <el-input v-model="addForm.goods_name" placeholder="商品名称" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item prop="goods_price" label="商品价格">
            <el-input v-model="addForm.goods_price" placeholder="商品价格" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item prop="goods_weight" label="商品重量">
            <el-input v-model="addForm.goods_weight" placeholder="商品重量" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item prop="goods_number" label="商品数量">
            <el-input v-model="addForm.goods_number" placeholder="商品数量" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="cateList"
              :props="defaultProps"
              change-on-select
              v-model="addForm.goods_cat"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
        <!-- 上传图片 -->
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            action="http://localhost:8888/api/private/v1/upload"
            :headers="getToken()"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="addGoods">添加商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addGoods, getCatList } from '@/api/goods_index.js'
export default {
  data () {
    return {
      // 设置请求头 需要返回一个对象
      getToken () {
        let token = localStorage.getItem('itcast_token')
        return { Authorization: token }
      },
      // 上传文件列表
      fileList: [],
      // 商品分类的级联的显示配置
      defaultProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 商品分类的数据源
      cateList: [],
      // 添加商品表单数据
      addForm: {
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        goods_cat: '',
        pics: []
      },
      // 标签页跟步骤条 动态绑定
      active: '',
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //   文件上传成功时触发
    handleSuccess (response, file, fileList) {
      console.log('上传成功时触发', response, file, fileList)
      if (response.meta.status === 200) {
        //   我们需要pic的数据
        this.addForm.pics.push({ pic: response.data.tmp_path })
      }
    },
    //   文件列表移除文件时的钩子 移除时触发
    handleRemove (file, fileList) {
      console.log('移除时触发', file)
      if (file.response.meta.status === 200) {
        console.log('进入移除')
        this.addForm.pics.forEach((item, index) => {
          if (item.pic === file.response.data.tmp_path) {
            console.log('移除成功')
            this.addForm.pics.splice(index, 1)
            console.log(this.addForm.pics)
          }
        })
      }
    },
    //   点击文件列表中已上传的文件时的钩子 预览时触发
    handlePreview (file) {
      console.log('预览时触发', file)
    },
    //   获取商品分类
    async getCat () {
      let res = await getCatList(3)
      //   console.log(res)
      this.cateList = res.data.data
    //   console.log(this.cateList)
    },
    // 添加商品
    addGoods () {
      // 注意good_cat的值不能是数组,在接口文档是以 , 隔开的字符串
      //   console.log(this.addForm.goods_cat)
      this.addForm.goods_cat = this.addForm.goods_cat.join(',')
      this.$refs.addForm.validate(valid => {
        if (valid) {
          //   console.log(this.addForm)
          addGoods(this.addForm).then(res => {
            //   console.log(res)
            this.$router.push({ name: 'goods' })
          })
        }
      })
    }
  },
  mounted () {
    this.getCat()
  }
}
</script>
<style lang="less" scoped>
</style>
