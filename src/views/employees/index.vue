<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 通用工具栏组件使用 -->
      <page-tools>
        <!-- 自定义左侧内容 -->
        <template v-slot:slot-left>
          <span>共 19 条记录</span>
        </template>

        <!-- 自定义右侧内容 -->
        <template slot="slot-right">
          <el-button type="danger" size="small">导入excel</el-button>
          <el-button type="success" size="small">导出excel</el-button>
          <el-button type="primary" size="small" @click="addEmpBtnFn">新增员工</el-button>
        </template>
      </page-tools>

      <!-- 员工列表+分页 -->
      <el-card style="margin-top: 10px;">
        <el-table border :data="employeesList">
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <!-- <el-table-column
            label="头像"
            prop="staffPhoto"
          /> -->
          <el-table-column
            label="头像"
            prop="staffPhoto"
          >
            <template v-slot="scope">
              <img v-if="scope.row.staffPhoto" :src="scope.row.staffPhoto" alt="">
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" />
          <el-table-column
            label="工号"
            prop="workNumber"
            sortable
            :sort-method="workNumberSortFn"
          />
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <!-- 使用插槽，需要组件内变量-作用域插槽 -->
            <!--
              在组件内，用<slot 属性名=”组件内变量“><slot/> (table-column写好了内部叫row)
              在插槽内，用template v-slot=“变量名”(变量会收集slot身上属性和值形成对象)
             -->
            <!-- <template v-slot="scope">
              <span>{{ scope.row.formOfEmployment===1? '正式':'非正式' }}</span>
            </template> -->
            <!-- <template v-slot="scope">
              <span>{{ hireTypeList.find(item=>item.id===scope.row.formOfEmployment).value }}</span>
            </template> -->
            <template v-slot="scope">
              <span>{{ formatter(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="部门"
            prop="departmentName"
          />
          <el-table-column label="入职时间" prop="timeOfEntry" :formatter="timeFormatter" />
          <el-table-column label="操作" width="280">
            <template slot-scope="scop">
              <el-button type="text" size="small">查看</el-button>
              <el-button
                type="text"
                size="small"
              >分配角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteFn(scop.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="end" align="middle" style="height: 60px">
          <!-- 分页区域 -->
          <el-pagination
            :current-page="query.page"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="query.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>

      <!-- 新增员工弹窗 -->
      <el-dialog
        title="新增员工"
        :visible.sync="showDialog"
        @close="closeFn"
      >
        <empForm
          ref="empForm"
          :show.sync="showDialog"
          :tree-data="treeData"
          @addEmpEV="addEmpEV"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getEmployeeListAPI, getDepartmentsList, addEmployeeAPI, delEmployeeAPI } from '@/api'
import Employees from '@/api/constant'
import dayjs from 'dayjs'
import empForm from './components/empForm.vue'
import { transTree } from '@/utils'
export default {
  name: 'Employees',
  components: {
    empForm
  },
  data() {
    return {
      query: {
        page: 1, // 页码
        size: 10 // 每页条数
      },
      employeesList: [], // 员工列表
      total: 0, // 数据总条数
      showDialog: false, // 新增员工弹窗显示/隐藏控制
      treeData: []// 部门列表树形结构
      // hireTypeList: Employees.hireType // 聘用形式-枚举数组
    }
  },
  created() {
    // 获取员工列表的数据
    this.getEmployeeListFn()
    // 获取部门列表数据
    this.getDepartmentsListFn()
  },
  methods: {
    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.query.size = newSize
      this.getEmployeeListFn()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.query.page = newPage
      this.getEmployeeListFn()
    },
    // 请求员工列表信息
    async getEmployeeListFn() {
      const { data: res } = await getEmployeeListAPI(this.query)
      // console.log(res)
      this.employeesList = res.rows
      this.total = res.total
    },
    formatter(row) {
    // row对应行的数据对象
      const obj = Employees.hireType.find(item => item.id === Number(row.formOfEmployment))
      return obj ? obj.value : '未知'
    },
    //! 工号自定义排序方法
    workNumberSortFn(a, b) {
      // a和b是表格，对应行数据(可以遍历到数组里所有对象)
      return Number(a.workNumber) - Number(b.workNumber)
    },
    // 时间格式化
    // 后台返回的事件不一定是什么?(后端没有做数据验证，录入新员工的同学，录入的格式不同)
    timeFormatter(row) {
      // console.log(row)
      return dayjs(row.timeOfEntry).format('YYYY-MM-DD')
    },
    // 新增员工按钮点击方法
    addEmpBtnFn() {
      this.showDialog = true
    },
    // 请求部门列表
    async getDepartmentsListFn() {
      const res = await getDepartmentsList()
      // console.log(res)
      this.treeData = transTree(res.data.depts, '')
      // console.log(this.treeData)
    },
    // 新增员工的网络请求
    async addEmpEV(empObj) {
      const res = await addEmployeeAPI(empObj)
      // console.log(res)
      this.getEmployeeListFn()
      this.$message.success(res.message)
    },
    // 关闭弹窗后重置表单
    closeFn() {
      this.$refs.empForm.$refs.addForm.resetFields()
    },
    // 删除功能
    async deleteFn(data) {
      // console.log(data.id)
      // 显示删除询问对话框
      const delRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 用户点击了取消，给用户进行提示
      if (delRes === 'cancel') return this.$message.info('您取消了删除')
      const res = await delEmployeeAPI(data.id)
      if (!res.success) return this.$message.error(res.message)
      // 删除成功后的提示
      this.$message.success(res.message)
      // 判断是不是最后一条数据
      if (this.employeesList.length === 1) {
        this.query.page--
        if (this.query.page <= 0) {
          this.query.page = 1
        }
      }
      // 获取员工列表的数据
      this.getEmployeeListFn()
    }
  }
}
</script>

<style lang="scss" scoped>
img {
    width: 100%;
    height: 100%;
}
</style>
