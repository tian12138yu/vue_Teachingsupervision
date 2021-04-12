<template>
  <div class="notice-panel">
    <div class="header">您有 {{data.length}} 条通知</div>
    <div style="height: 300px;">
      <el-scrollbar style="height: 100%;">
        <div class="notice-content">
          <el-card >
            <div v-for="item in data" :key="item.index" class="notice-item">
            <span class="notice-icon">
              <li class="fa fa-envelope-o"></li>
            </span>
              <span class="notice-content">
              {{ item.message }}
            </span>
              <br>
              <span class="notice-icon">
              <li class="fa fa-clock-o" aria-hidden="true"></li>
            </span>
              <span class="notice-content">
              {{item.time}}
            </span>
              <br>
              <div class="rt">
                <span >
                  <el-button type="warning" size="mini" @click="change(item)"  v-if="item.state===0" >确 定</el-button>
                  <el-button type="primary" size="mini"  disabled v-if="item.state!==0 && item.type !==5">已 读</el-button>
                  <el-button type="primary" size="mini"  disabled v-if="item.type ===5">O K</el-button>

                 </span>
              </div>
            </div>
          </el-card>
        </div>
      </el-scrollbar>
    </div>

  </div>
</template>

<script>
export default {
  name: 'NoticePanel',
  // props: {
  //   data: {
  //     type: Array,
  //     default: () => [
  //       {
  //         state:1,
  //         message:'你修改了用户密码1',
  //       },{
  //         state:1,
  //         message:'你修改了用户密码2',
  //       },{
  //         state: 1,
  //         message:'你修改了用户密码3',
  //       },{
  //         state:1,
  //         message:'你修改了用户密码4',
  //       },
  //       ]
  //   },
  // },
  created() {
    this.getUser();
    this.getNotice();
  },
  data() {
    return {
      x:1,
      user:'',
      data:[],
    }
  },
  methods: {
    handleClick: function () {
      // 按钮操作处理函数
      this.$emit('click', {})
    },
    async getUser () {
      this.user = JSON.parse(window.sessionStorage.getItem('user'));
      // console.log(this.user.username);
    },
    async change(val) {
      console.log(val);
      const {data:res} = await this.$http.get("updateNotice?id="+val.id);
      console.info(res);
      this.getNotice();
    },
    async getNotice() {
      const {data:res} = await this.$http.post("getNotice",this.user);
      console.log('notice:'+res);
      this.data = res;
    },
  },
  mounted() {
  }
}
</script>

<style lang="less" scoped>
//.scrollbar {
//  /*white-space: nowrap; */
//  .el-scrollbar {
//    display: flex;
//    justify-content: space-around;
//    padding: 0 10px;
//  }
//  .el-scrollbar__wrap {  // 必要的
//    overflow: scroll;
//    width: 110%;
//    margin-right: -60px;
//  /*//隐藏侧边默认滚动条 */
//  /*（达不到效果可以自己试着微调） 如解决不了可尝试用 `margin-right -60px`*/
//  height: 100%;
//  /*//隐藏底部滚动条  （*/
//  /*100%如果达不到效果可以试着用110%）*/
//  }
//}
.el-scrollbar{
  height: 90%;
  .scrollbar-wrap{
    //overflow-x: hidden;
  }
  .el-scrollbar__bar{

  }
}
.notice-panel {
  font-size: 15px;
  width: 250px;
  margin: -12px;
}
.header {
  padding-left: 10px;
  font-size: 14px;
  padding-top: 6px;
  padding-bottom: 6px;
}
.notice-content {
  font-size: 15px;

}
.rt{
  //float:right;
  padding-left: 130px;
  //margin:auto; width: 100px
}

.notice-item {
  border-color: rgba(180, 190, 190, 0.8);
  border-top-width: 1px;
  border-top-style: solid;
  padding-top: 10px;
  padding-bottom: 10px;
}
.notice-item:hover {
  cursor: pointer;
  background: #b1a6a61e;
}
.notice-icon {
  padding-left: 10px;
  padding-right: 5px;
}
.notice-footer {
  font-size: 14px;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-color: rgba(180, 190, 190, 0.8);
  border-top-width: 1px;
  border-top-style: solid;
}
.notice-footer:hover {
  cursor: pointer;
  background: #b1a6a61e
}
</style>
