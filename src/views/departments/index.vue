<template>
  <div class="departments-container">
    <div class="app-container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <!-- el-tab-pane有几个, 就有几个tab标签导航
               el-tab-pane夹着的内容, 就是这个导航对应的内容
               el-card只用到了头(没有体), 体用的是el-tab标签导航的身体内容(一切放在了卡片的头里写)

               el-tabs: Tabs标签页导航
                      v-model: 绑定点击激活的name值
                      @tab-click: tab导航点击事件
               el-tab-pane: 每个tab标签导航
                      label: tab导航显示文字
                      name: 点击关联到v-model的值
           -->
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="组织架构" name="first" class="tab-pane">
              <!-- class="tab-pane"设置左右padding, 把内容往中间挤压 -->
              <!-- 使用 Layout 布局绘制头部区域
                最外层一行, 2列
                  el-row: type布局模式
                          justify两端对齐
                          align交叉轴排列方式(垂直方向居中)
               -->
              <!-- 头部 -->
              <el-row
                type="flex"
                justify="space-between"
                align="middle"
                class="department-header"
              >
                <!-- 第一列20份 -->
                <el-col :span="20">
                  <i class="el-icon-s-home" />
                  <span class="company">山西砸破科技股份有限公司</span>
                </el-col>
                <!-- 第二列4份 -->
                <el-col :span="4">
                  <!-- 在容器范围里, 一行再分2列 -->
                  <el-row type="flex" justify="end">
                    <el-col>负责人</el-col>
                    <el-col>
                      <!-- 这个之前在头部导航右侧下拉菜单讲过 -->
                      <el-dropdown>
                        <!-- 下拉菜单文字 -->
                        <span class="el-dropdown-link">
                          操作<i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <!-- 下拉项 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            @click.native="add()"
                          >添加子部门</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!-- 列表 -->
              <el-tree
                class="departments-tree"
                :data="Treedata"
                :props="defaultProps"
                node-key="id"
                :default-expand-all="true"
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
              >
                <!-- 默认插槽  并且使用内部的数据进行自定义模板的渲染
                  scope.data 所以直接key解构赋值变量也是data(对应数据对象)
                 -->
                <template #default="{ data }">
                  <el-row
                    type="flex"
                    justify="space-between"
                    align="middle"
                    style="height: 40px; width: 100%"
                  >
                    <!-- 部门名字 -->
                    <el-col :span="20">
                      <span>{{ data.name }}</span>
                    </el-col>
                    <!-- 功能操作区域 -->
                    <el-col :span="4">
                      <el-row type="flex" justify="end">
                        <!-- 两个内容 -->
                        <el-col>{{ data.manager }}</el-col>
                        <el-col>
                          <!-- 下拉菜单 element -->
                          <el-dropdown>
                            <span> 操作<i class="el-icon-arrow-down" /> </span>
                            <!-- 下拉菜单 -->
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item
                                @click.native="add(data)"
                              >添加子部门</el-dropdown-item>
                              <el-dropdown-item
                                @click.native="edit(data)"
                              >编辑部门</el-dropdown-item>
                              <el-dropdown-item
                                v-if=" !data.children"
                                @click.native="del(data)"
                              >删除部门</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </template>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
      <DepartDialog
        ref="departDialog"
        :dialog-visible.sync="dialogVisible"
        :employee-simple-list="EmployeeSimpleList"
        :origin-list="originList"
        :click-depart-id="clickDepartId"
        :is-edit="isEdit"
        @addDepartEV="addDepartFn"
      />
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getDepartmentsList, getEmployeeSimpleAPI, addDepartmentsAPI,
  getDepartDetailAPI, updateDepartmentsAPI, delDepartmentAPI } from '@/api'
import { transTree } from '@/utils'
import DepartDialog from './components/departDialog.vue'
export default {
  name: 'Departments',
  components: { DepartDialog },
  data() {
    return {
      activeName: 'first',
      dialogVisible: false, //! 添加子部门弹窗显示/隐藏
      Treedata: [
        {
          departName: '总裁办',
          name: '孙财'
        },
        {
          departName: '行政部',
          name: '罗晓晓'
        },
        {
          departName: '人事部',
          name: '安小晴',
          children: [
            {
              departName: '财务核算部'
            }
          ]
        },
        {
          departName: '财务部',
          name: '',
          children: [
            {
              departName: '财务核算部'
            },
            {
              departName: '税务管理部'
            },
            {
              departName: '薪资管理部'
            }
          ]
        },
        {
          departName: '技术部',
          name: '',
          children: [
            {
              departName: '前端技术部'
            },
            {
              departName: '后端技术部'
            }
          ]
        },
        {
          departName: '运营部',
          name: ''
        },
        {
          departName: '市场部',
          name: '武高丽',
          children: [
            {
              departName: '市场部1'
            },
            {
              departName: '市场部2'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'departName'
      },
      EmployeeSimpleList: [], // 员工信息简单列表
      //! 当一个方法中的值要在另外一个方法中用的时候，可以在data中定义变量中转
      clickDepartId: '', // 点击哪个部门就是哪个部门的ID
      isEdit: false, // 添加/编辑 -> 部门状态(true编辑。false新增)
      originList: []// 用于校验的部门规则数组
    }
  },
  created() {
    // 获取部门列表
    this.getDepartmentsListFn()
    // 获取员工简单列表
    this.getEmployeeSimpleListFn()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleNodeClick(data) {
      // console.log(data)
      this.clickDepartId = data.id
    },
    // 正文部分-右侧的添加子部门
    //! 两种情况头部的添加子部门和treeData里的添加子部门
    //! 一级部门的pid=''
    add(data) {
      if (data === undefined) {
        this.clickDepartId = ''// 公司右侧添加
      } else {
        this.clickDepartId = data.id // 保存当前部门id
      }
      this.dialogVisible = true // 弹窗出现
      this.isEdit = false// 区别添加和/编辑的标记
      // console.log(data)
    },
    // 编辑子部分
    async edit(data) {
      this.clickDepartId = data.id // 编辑时的id
      this.dialogVisible = true
      this.isEdit = true
      const res = await getDepartDetailAPI(data.id)
      // console.log(res)
      this.$refs.departDialog.form = res.data
    },
    // 删除部分
    async del(data) {
      const res = await delDepartmentAPI(data.id)
      // console.log(res)
      Message.success(res.message)
      //! 删除完成以后刷新列表
      this.getDepartmentsListFn()
    },
    async getDepartmentsListFn() {
      // 得到部门列表
      const { data: res } = await getDepartmentsList()
      // 扁平的数组里对象，映射一份只有关键4对key+value值对象，形成一个新数组，用于传入表单组件做判断
      this.originList = res.depts.map(item => (
        {
          id: item.id,
          code: item.code,
          name: item.name,
          pid: item.pid // 下面使用
        }
      ))
      console.log(this.originList)
      this.Treedata = transTree(res.depts, '')
    },
    // 获取员工简单列表
    async getEmployeeSimpleListFn() {
      const { data: res } = await getEmployeeSimpleAPI()
      this.EmployeeSimpleList = res
    },
    // 添加子部门的方法
    async addDepartFn(formObj) {
      if (this.isEdit) { //! 编辑
        const res = await updateDepartmentsAPI(formObj)
        Message.success(res.message)
        // console.log(res)
      } else {
        //! 添加
        formObj.pid = this.clickDepartId
        const res = await addDepartmentsAPI(formObj)
        Message.success(res.message)
      }
      //! 添加/编辑完成以后刷新列表
      this.getDepartmentsListFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.departments-tree{
    margin-top: 15px;
}
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px 80px;

  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }

  .department-header {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
}
</style>
