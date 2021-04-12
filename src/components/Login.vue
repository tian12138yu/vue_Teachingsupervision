<template>
  <div class="login_container">
    <img :src="imgSrc" width="100%" height="100%" alt="" />
    <el-card class ="card">

      <div class="login_box">
        <div class="avatar_box">
          <!--头像-->
          <img src="../assets/timg.gif" alt />
        </div>
<!--        <span>欢迎使用教学督导系统！</span>-->
        <!--添加表单-->
        <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login_form"
            label-width="0px"
        >
<!--          <span>欢迎使用教学督导系统！</span>-->
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-yonghudenglu"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="iconfont icon-mima" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-select v-model="loginForm.role" placeholder="请选择登录角色">
              <el-option label="督导员" value="0"> </el-option>
              <el-option label="管理员" value="1"> </el-option>
              <el-option label="教师" value="2"> </el-option>
              <el-option label="学生" value="3"> </el-option>
              <el-option label="学院" value="4"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
        role:'1'
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ]
      },
      imgSrc:require('../assets/demo2.png')
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        // 调用post请求
        const {data :res} = await this.$http.post("login", this.loginForm);

        if (res === 'fail') {
          this.$message.error("账号或密码错误！！！");
        }else {
          if (res !== '') {
            window.sessionStorage.setItem('flag','ok'); // session 放置
            console.log(res);
            let user = JSON.stringify(res);
            // console.log(JSON.parse(user).username);
            window.sessionStorage.setItem('user',user);
            this.$message.success("登陆成功！！！");
            await this.$router.push({
              path: "/home",
            });
          }else{
            this.$message.error("登录失败！！！");
          }
        }

      });
    }
  }
};
</script>

<style lang="less" scoped>

// 跟节点样式
.login_container {
  width:100%;
  height: 100%;
  z-index: -1;
}

.card {
  width: 400px;
  margin-top: 15%;
  margin-left: calc(calc(100vw - 400px) / 2);
  background-color: #00FAD3 ;
  border-color: #00FAD3;
  border-radius: 10px;
}

// 登录框
.login_box {
  z-index: 1;
  width: 450px;
  height: 300px;
  background-color: #EEEEEE;
  border-radius: 3px;// 圆角
  position: absolute;// 绝对定位
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);// 根据自己位置 以自己为长度位移
  // 头像框
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eeeeee;
    border-radius: 50%; // 加圆角
    padding: 10px;
    box-shadow: 0 0 10px #ddd;// 盒子阴影
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    //background-color: #0ee;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%; // 加圆角
      background-color: #eee;
    }
  }
  .btns {
    display: flex;// 弹性布局
    justify-content: flex-end; // 尾部对齐
  }
  .login_form {
    position: absolute;
    bottom: 0%;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;// 设置边框
  }
}
</style>
