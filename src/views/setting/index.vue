<template>
  <div class="setting-container">
    <div class="app-container">
      <!-- 卡片组件 -->
      <el-card class="box-card">
        <!-- 使用 Tabs 组件完成标签页布局 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first" class="tab-pane">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRoleBtnFn"
              >新增角色</el-button>
            </el-row>
            <!-- 使用 Table 组件实现用户角色的渲染 -->
            <el-table border style="width: 100%" :data="rolesList">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" type="success" @click="setRoles(scope.row)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRoles(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRoles(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <!--
              pagenation不关联数据，需要自己写
              current-page：设置高亮页数
              page-sizes：选择每页显示的条数（下拉菜单中）
              page-size：每页显示条数
              layout 控制每个小组件是否需要，以及排列顺序
              total：必须告诉分页组件，我有多少条数据
              size-change每页显示多少条发生改变
              current-change当前页码切换
             -->
            <el-pagination
              :current-page="query.page"
              :page-sizes="[3,5 , 7, 9]"
              :page-size="query.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
          <el-tab-pane label="公司信息" class="tab-pane">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="companyObj.name"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="companyObj.companyAddress"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="companyObj.mailbox"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="companyObj.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 新增弹框 -->
      <el-dialog
        :title="isEdit?'编辑角色':'新增角色'"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="showDialog"
        @close="roleDialogCloseFn"
      >
        <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>

        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="cancleRoles">取消</el-button>
            <el-button size="small" type="primary" @click="roleSubmit">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRolesAPI, updateRoleAPI,
  getCompanyInfoAPI, addRoleAPI, getRoleDetailAPI, getUserProfileAPI, deleteRoleAPI } from '@/api'
export default {
  data() {
    return {
      activeName: 'first',
      isEdit: false,
      query: {
        page: 1, // 当前页面
        pagesize: 3 // 页面显示的条数
      },
      rolesList: [], // 角色列表
      total: 0, // 角色数据总条数
      companyObj: {}, // 公司信息
      showDialog: false, // 控制弹框的隐藏和展示
      // 添加角色
      roleForm: {
        name: '',
        description: ''
      },
      // 添加角色验证
      roleRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  // 调用获取角色列表的方法
    this.getRolesListFn()
    this.getCompanyDetailFn()
  },
  methods: {
    // 每页显示的条数发生改变时触发
    handleSizeChange(size) {
      this.query.pagesize = size
      this.getRolesListFn()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(page) {
      this.query.page = page
      this.getRolesListFn()
    },

    // 设置角色
    setRoles() {},

    // 编辑角色
    async editRoles(roleObj) {
      this.isEdit = true
      // roleObj那一行的角色对象
      // console.log(roleObj)
      this.showDialog = true
      const res = await getRoleDetailAPI(roleObj.id)
      // console.log(res)
      this.roleForm = res.data
    },

    // 删除角色
    async delRoles(roleObj) {
      await deleteRoleAPI(roleObj.id)
      if (this.rolesList.length === 1) {
        this.query.page--
        if (this.query.page === 0) {
          this.query.page = 1
        }
      }
      this.getRolesListFn()
    },
    // 获取角色列表
    async getRolesListFn() {
      // 发起请求
      const res = await getRolesAPI(this.query)
      // console.log(res)
      this.rolesList = res.data.rows
      this.total = res.data.total
    },
    // 获取公司详情
    async getCompanyDetailFn() {
      const { data: { companyId }} = await getUserProfileAPI()
      const res = await getCompanyInfoAPI(companyId)
      // console.log(res)
      this.companyObj = res.data
    },
    // 角色弹框-> 确定按钮
    roleSubmit() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) { // 编辑
          if (this.isEdit) {
            await updateRoleAPI(this.roleForm)
          } else {
            //! 新增
            // console.log(this.roleForm)
            await addRoleAPI(this.roleForm)
            // console.log(res)
          }
          this.getRolesListFn()
          this.showDialog = false
        }
      })
    },

    // 角色弹框-> 取消按钮
    cancleRoles() {
      this.showDialog = false
    },
    // 新增角色->按钮点击事件
    addRoleBtnFn() {
      this.showDialog = true
      this.isEdit = false
    },
    roleDialogCloseFn() {
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
