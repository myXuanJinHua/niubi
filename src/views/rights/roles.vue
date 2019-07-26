<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色的按钮 -->
    <el-button type="success" plain @click="addRole">添加角色</el-button>
    <!-- 添加角色的dialog -->
    <el-dialog title="添加角色" :visible.sync="addRoleFormVisible">
      <el-form :model="addRoleForm" ref="addRoleForm" :rules="rules">
        <el-form-item label="角色名称" :label-width="'120px'" prop="roleName">
          <el-input v-model="addRoleForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="'120px'" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleSumbit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色列表 -->
    <el-table :data="roleTableData" style="width: 100%">
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            :gutter="20"
            v-for="tag in scope.row.children"
            :key="tag.id"
            style="margin-bottom:10px;border-bottom:1px dashed #ccc"
          >
            <el-col :span="4">
              <el-tag closable :type="'success'" @close="delrole(scope.row,tag.id)">{{tag.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="item in tag.children" :key="item.id" style="margin-bottom:10px">
                <el-col :span="4">
                  <el-tag
                    closable
                    :type="'success'"
                    @close="delrole(scope.row,item.id)"
                  >{{item.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="warning"
                    style="margin:0px 10px 5px 0px"
                    v-for="ai in item.children"
                    :key="ai.id"
                    @close="delrole(scope.row,ai.id)"
                  >{{ai.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row></el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top-end">
            <el-button type="primary" icon="el-icon-d-caret" @click="grantShow(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
            <el-button type="primary" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 授权角色dialog对话框 -->
    <el-dialog title="授权角色" :visible.sync="grantFormVisible">
      <el-tree
      ref="tree"
        :data="grantArr"
        show-checkbox
        node-key="id"
        :default-expand-all='true'
        :default-checked-keys="checkedArr"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantSumbit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllRoleList, delUserRight, addRoleList } from '@/api/role_index.js'
import { getAllRightList, grantRight } from '@/api/right_indx.js'
export default {
  data () {
    return {
      // 角色ID
      roleId: '',
      // 默认被选中的权限ID节点集合数组
      checkedArr: [],
      // 角色授权对话框设置节点的查询属性和显示属性
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      // 授权角色的数据数组
      grantArr: [],
      // 授权角色的dialog的隐藏
      grantFormVisible: false,
      // 添加角色dialog的隐藏
      addRoleFormVisible: false,
      // 添加角色表单的值
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 角色列表的数组
      roleTableData: [],
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 授权角色的确定点击事件
    async grantSumbit () {
      // 获取里面的被选中的权限的ID
      // console.log(this.$refs.tree.getCheckedNodes())
      let arr = this.$refs.tree.getCheckedNodes()
      let temp = []
      arr.forEach(item => {
        temp.push(item.id + ',' + item.pid)
      })
      // console.log(temp) // temp是数组
      // 把temp 有数组转成字符串str
      let str = temp.join(',')
      // console.log(str)
      // 把str劈开成数组
      let newStr = str.split(',')
      // console.log(newStr)
      // 利用数组去重
      let newArr = [...new Set(newStr)]
      // console.log(newArr)
      // 因为数据传送需要的是字符串所以要把得到的数组转成字符串才能使用
      // console.log(this.roleId, newArr.join(','))
      let res = await grantRight(this.roleId, newArr.join(','))
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.grantFormVisible = false
        this.init()
      }
    },
    // 授权角色的对话框打开
    async grantShow (row) {
      this.roleId = row.id
      this.grantFormVisible = true
      let res = await getAllRightList('tree')
      // console.log(res)
      this.grantArr = res.data.data
      // 需要清空checkedArr 里面的数据
      this.checkedArr.length = 0
      // 获取当前角色的所有权限ID,通过嵌套的遍历(观察数据的结构写出代码的结构)来获取到最后一层遍历的结果
      // console.log(row, row.children)
      if (row.children && row.children.length > 0) {
        row.children.forEach(first => {
          if (first.children && first.children.length > 0) {
            first.children.forEach(second => {
              if (second.children && second.children.length > 0) {
                second.children.forEach(third => {
                  this.checkedArr.push(third.id)
                // console.log('third', this.checkedArr)
                })
              }
            })
          }
        })
      }
      // console.log(this.checkedArr)
    },
    // 初始化
    init () {
      getAllRoleList()
        .then(res => {
          // console.log(res)
          this.roleTableData = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // roleId:角色id
    // rightId:权限id
    // 下拉菜单的删除角色的权限
    delrole (row, rightId) {
      // console.log(row.id, rightId)
      delUserRight(row.id, rightId)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            row.children = res.data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 添加角色按钮的点击事件
    addRole () {
      this.addRoleFormVisible = true
    },
    // 添加角色的确定按钮点击事件
    async addRoleSumbit () {
      let res = await addRoleList(this.addRoleForm)
      // console.log(res)
      if (res.data.meta.status === 201) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
        this.addRoleFormVisible = false
        this.init()
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
