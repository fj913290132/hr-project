<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">
          <img src="../../assets/common/login-logo.png" alt="">
        </h3>
      </div>

      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="mobile"
          v-model="loginForm.mobile"
          placeholder="Mobile"
          name="mobile"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        class="login_btn"
        @click.native.prevent="handleLogin"
      >登录</el-button>

      <div class="tips">
        <span style="margin-right:20px; font-size:20px; color:pink;">默认账号:  13800000002</span><br><br><br>
        <span style="margin-right:20px; font-size:20px; color:pink;">默认密码:  123456</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validMoblie } from '@/utils/validate'
import { getUserProfileAPI } from '@/api'
export default {
  name: 'Login',
  data() {
    const validateMoblie = (rule, value, callback) => {
      if (!validMoblie(value)) {
        callback(new Error('请你输入11位正确的中国大陆手机号码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      loginRules: {
        mobile: [{ required: true, trigger: 'change', validator: validateMoblie }],
        password: [{ required: true, trigger: 'blur', min: 6, max: 16, message: '密码长度在6-16位之间' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          //! 通过表单校验->发起登录请求
          //! await只能提取promise成功状态的值
          //! await取代.then的函数，把成功的值拿出来放在原地
          //! 捕获promise错误的状态，使用try+catch
          /* try {
            const res = await loginAPI(this.loginForm)
            this.$store.commit('user/SET_TOKEN', res.data)
          } catch (error) {
            //! 一但try报错就会进入这里，error接收的是错误对象信息
            // console.dir(error)
          } */
          try {
            //! 不加await，会调用登录接口的时候，这个登录异步任务无结果的时候，
            //! 代码会往下走就跳转进去了(问题：密码错了也跳)
            const res = await this.$store.dispatch('user/loginActions', this.loginForm)
            // console.log(res)
            //! await 等待后面成功了，才会继续往下走
            this.$message.success(res.message)
            //! 拿到回传未遂地址的路径字符串  this.$route.query
            this.$router.replace(this.$route.query.redirect || '/')
          } catch (error) {
            console.dir(error)
            //  console.log('cuole')
          }
        }
      })
    },
    async testFn() {
      const res = await getUserProfileAPI()
      console.log(res)
      console.log(123)
    }
  }
}
</script>

<style lang="scss">
/* reset element-ui css */
.el-form-item__error {
    font-size: 14px
}
.login_btn{
    background: #407ffe;
    height: 64px;
    line-height: 32px;
    font-size: 24px;
}
$bg:#283443;
$light_gray: #68b0fe;  // 将输入框颜色改成蓝色
$cursor: #68b0fe; // 将输入框光标改成蓝色
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

/* $bg:#283443;
$light_gray:#fff;
$cursor: #fff; */

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background: url('../../assets/common/login.jpg');
  background-position: center;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    background: rgba(255, 255, 255, 0.7);
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
