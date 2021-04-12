<template>
    <div class="success_background">
        <div class="success_massage">操作成功！！！
            {{this.$route.params.message}}
        </div>
        <div class="go_home">
            <el-button type="info" @click="toHome">@去首页@</el-button>
        </div>
        <div class="exit_btn">
            <el-button type="info" @click="logout">安全退出</el-button>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .success_massage{
        width: 300px;
        margin: 0 40%;
        background-color: aqua;
        font-size: 30px;
        text-align: center;
    }
    .go_home{
        margin-top:15px;
        margin-bottom: 10px;
    }
</style>

<script>
export default {
  data() {
    return {
      formId :'0'
    };
  },
  created() {
    console.log("页面初始化完成111");
    debugger;
    this.getUrl();
  },
  methods: {
    logout(){
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    toHome(){
      this.$router.push('/home');
    },
    async getUrl () {
      debugger;
      var url = document.URL; //获取当前页面的url
      var urlA = url.split('?');//以url中的问号进行分割;
      var id = urlA[1].split('=');
      this.$data.formId = id[1]; //
      return this.$message.info(this.$data.formId);
    }

  },
}
</script>
