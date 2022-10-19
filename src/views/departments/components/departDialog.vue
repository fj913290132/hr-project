<template>
  <div>
    <el-dialog
      title="添加部门"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @close="dialogCloseFn"
    >
      <!-- form表单 -->
      <el-form
        ref="deptForm"
        :model="form"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
            <el-option v-for="item in employeeSimpleList" :key="item.id" :value="item.username" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <!--  -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean
    },
    employeeSimpleList: {
      type: Array,
      default: () => []
    },
    originList: { // 关键部门信息形成的一个新数组(扁平的)
      type: Array,
      default: () => []
    },
    clickDepartId: { // 点击时的id
      type: String,
      default: () => ''
    },
    isEdit: { // 编辑/新增的标识符
      type: Boolean,
      default: () => false
    }
  },
  data() {
    const validCode = (rule, value, callback) => {
      // 新增部门：code部门编码，不能喝所有人相同
      let codeList = this.originList.map((item) => item.code)// ['RES','ZCB']
      if (this.isEdit) {
        const newArr = this.originList.filter(item => item.id !== this.clickDepartId)
        codeList = newArr.map(item => item.code)
      }
      codeList.includes(value) ? callback(new Error('该编码您不能使用')) : callback()
    }
    const validNmae = (rule, value, callback) => {
      // 新增部门名字：(先找到同级的对象)  子部门的pid=父部门id
      let nameList = this.originList.filter(item => item.pid === this.clickDepartId).map(item => item.name)
      if (this.isEdit) {
        // 先找到正在编辑的这个部门对象
        const obj = this.originList.find(item => item.id === this.clickDepartId)
        // 找到编辑对象，才能拿到pid
        const pid = obj.pid
        // 拿到pid，才能继续从所有部门列表中，找到pid相同的对象
        nameList = this.originList.filter(item => item.pid === pid && item.id !== this.clickDepartId).map(item => item.name)
      }
      nameList.includes(value) ? callback(new Error('该名字不能让你使用')) : callback()
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'change' },
          { min: 2, max: 10, message: '部门名称要求2-10个字符', trigger: 'blur' },
          { validator: validNmae, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '部门编码要求1-20个字符', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    //! 确认框取消点击事件
    cancelFn() {
      this.$emit('update:dialogVisible', false)
    },
    //! 确认框确认点击事件
    confirmFn() {
      this.$refs.deptForm.validate((valid) => {
        if (valid) {
          this.$emit('addDepartEV', { ...this.form })
          this.$emit('update:dialogVisible', false)
        }
      })
    },
    //! 弹窗闭关后的回调
    dialogCloseFn() {
      this.form = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
