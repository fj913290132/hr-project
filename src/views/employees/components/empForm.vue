<template>
  <!-- 表单 -->
  <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
    <el-form-item label="姓名" prop="username">
      <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
    </el-form-item>
    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
        <el-option
          v-for="(item,index) in hireType"
          :key="index"
          :label="item.value"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="工号" prop="workNumber">
      <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
    </el-form-item>
    <el-form-item label="部门" prop="departmentName">
      <el-input
        v-model="formData.departmentName"
        style="width:50%"
        placeholder="请选择部门"
        readonly
        @focus="departmentNameFocus"
      />
      <div class="tree-box">
        <el-tree
          v-show="showTree"
          :data="treeData"
          default-expand-all
          :props="{ label: 'name' }"
          @node-click="treeClick"
        />
      </div>
    </el-form-item>
    <el-form-item label="转正时间" prop="correctionTime">
      <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
    </el-form-item>
    <el-form-item>
      <el-button @click="addCancel">取消</el-button>
      <el-button type="primary" @click="addSubmit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Employees from '@/api/constant'
export default {
  name: 'EmpForm',
  props: {
    treeData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    // 添加表单字段
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ]
      },
      hireType: Employees.hireType, // 聘用形式枚举数组
      showTree: false // 部门树形控件显示/隐藏
    }
  },
  methods: {
    // 点击取消按钮的函数
    addCancel() {
      this.$emit('update:show', false)
    },
    // 点击确定按钮的函数
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) { // 通过表单校验
          this.$emit('addEmpEV', { ...this.formData })
          this.$emit('update:show', false)
        }
      })
    },
    // 部门输入框的聚焦事件
    departmentNameFocus() {
      this.showTree = true
    },
    // 部门树形控件->点击事件
    treeClick(data) {
      // console.log(data)
      if (data && data.children) {
        return
      }
      this.formData.departmentName = data.name
      this.showTree = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
