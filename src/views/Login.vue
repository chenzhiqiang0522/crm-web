<template>
  <el-form :model="loginForm2" :rules="loginFormRules2" ref="loginFormRules2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="loginForm2.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="loginForm2.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestLogin } from '../api/api';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        loginForm2: {
          username: 'admin',
          password: '123456'
        },
          loginFormRules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.loginFormRules2.resetFields();
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.loginFormRules2.validate((valid) => {
            this.$http.post("/login",this.loginForm2)
                .then(result => {
                    result = result.data;
                    console.log(result)
                    if (result.success){
                        // route.push("/echarts")
                        localStorage.setItem("token",result.resultObj.token)
                        let s = JSON.stringify(result.resultObj.loginUser);
                        let temp = JSON.parse(s);
                        console.log(typeof result.resultObj.loginUser)
                        console.log(typeof s)
                        localStorage.setItem("token",result.resultObj.token)
                        localStorage.setItem("loginUser",s)
                        this.$router.push("/echarts")
                    }else{
                        this.logining = false;
                        this.$message({
                            type:"error",
                            message:result.resultObj
                        })
                    }
                })

        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>