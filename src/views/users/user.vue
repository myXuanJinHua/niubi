<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框和添加用户按钮 -->
    <div style="margin: 15px 0;">
      <el-input
        placeholder="请输入内容"
        v-model="userobj.query"
        class="input-with-select"
        @keyup.enter.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" @click="addFormVisible=true">添加用户</el-button>
    </div>
    <!-- 用户列表 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="email" label="邮件" width="180"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="300"></el-table-column>
      <el-table-column label="用户状态" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changesta(scope.row.id,scope.row.mg_state)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
            <el-button type="primary" icon="el-icon-edit" @click="showEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top-end">
            <el-button type="primary" icon="el-icon-d-caret"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
            <el-button type="primary" icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加用户的dialog的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addFormVisible">
      <el-form :model="userForm" ref="userForm" :rules="rules">
        <el-form-item label="用户名" :label-width="'120px'" prop="username">
          <el-input v-model="userForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" :label-width="'120px'" prop="password">
          <el-input v-model="userForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="'120px'" prop="email">
          <el-input v-model="userForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="'120px'" prop="mobile">
          <el-input v-model="userForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSumbit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户的dialog -->
    <el-dialog title="编辑用户" :visible.sync="editFormVisible">
      <el-form :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="用户名" :label-width="'120px'" prop="username">
          <el-input v-model="editForm.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="'120px'" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="'120px'" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSumbit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页功能 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="sun">
    </el-pagination>
  </div>
</template>
<script>
import { getAllUserList, addUserList, delUser, editUser, changeState } from '@/api/user_login'
export default {
  data () {
    return {
      // 编辑用户的表单项
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      // 编辑用户表单的隐藏
      editFormVisible: false,
      // 添加用户的表单项
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单的隐藏
      addFormVisible: false,
      // 用户页码,搜索框的
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 总页码数
      total: 2,
      sun: 0,
      // 页面用户列表的数据
      tableData: [],
      // 表单的验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [

          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: /\w+[@]\w+[.]\w+/, message: '请输入合法的邮箱', trigger: 'blur' }

        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入合法手机号码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 初始化页面数据
    init () {
      getAllUserList(this.userobj)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.total = Math.ceil(res.data.data.total / res.data.data.pagesize)
            this.sun = res.data.data.total
            this.tableData = res.data.data.users
            //   console.log(this.tableData)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 添加用户
    addSumbit () {
      this.$refs.userForm.validate((vaild) => {
        if (vaild) {
          addUserList(this.userForm)
            .then((res) => {
              console.log(res)
              if (res.data.meta.status === 201) {
                // 弹出提示框
                this.$message({
                  message: '添加用户成功啦',
                  type: 'success'
                })
                // 重置表单项
                this.$refs.userForm.resetFields()
                // 隐藏表单
                this.addFormVisible = false
                // 初始化
                this.init()
              }
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          this.$message({
            message: '输入信息不合法',
            type: 'error'
          })
        }
      })
    },
    // 切换每页显示数量时触发
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.userobj.pagesize = val
      this.init()
    },
    // 切换到当前页码时触发
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.userobj.pagenum = val
      this.init()
    },
    // 根据ID删除用户数据
    delUser (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        delUser(id)
          .then((res) => {
            if (res.data.meta.status === 200) {
              // console.log(res.data.meta.status)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              // console.log(this.tableData)
              if (this.tableData.length === 1) {
                --this.userobj.pagenum
                this.init()
              } else {
                this.init()
              }
            }
          })
          .catch((err) => {
            console.log('文件删除出错', err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 显示编辑用户数据
    showEdit (row) {
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
      this.editFormVisible = true
    },
    // 发送编辑用户数据
    editSumbit () {
      this.$refs.editForm.validate((vaild) => {
        if (vaild) {
          console.log(this.userForm)
          editUser(this.editForm)
            .then((res) => {
              console.log(res)
              if (res.data.meta.status === 200) {
                // 弹出提示框
                this.$message({
                  message: '编辑用户成功啦',
                  type: 'success'
                })
                // 重置表单项
                this.$refs.editForm.resetFields()
                // 隐藏表单
                this.editFormVisible = false
                // 初始化
                this.init()
              }
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          this.$message({
            message: '输入信息不合法',
            type: 'error'
          })
        }
      })
    },
    // 切换状态
    changesta (id, type) {
      changeState(id, type)
        .then((res) => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.$message({
              message: res.data.meta.msg,
              type: 'success'
            })
          }
        })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
.users {
  .input-with-select {
    width: 300px;
    margin-right: 10px;
  }
}
</style>
