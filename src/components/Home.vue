<template>
  <el-container class="home-container">
    <!--头部布局-->
    <el-header class="el-header">
      <div>
<!--        <img src="../assets/man.jpg" alt class="logo_img" />-->
        <span>教学督导管理平台</span>
      </div>
      <div class="right-menu">
        <el-menu class="el-menu-demo" background-color="rgb(48, 65, 86)" text-color="rgb(48, 65, 86)" active-text-color="rgb(48, 65, 86)" mode="horizontal">
          <el-menu-item index="1" v-popover:popover-notice>
            <!-- 系统通知 -->
            <el-badge :value=noticeNum :max="99" class="badge" type="success">
              <li style="color:#fff;" class="fa fa-bell-o fa-lg"></li>
            </el-badge>
            <el-popover ref="popover-notice" placement="bottom-end" trigger="click">
              <notice-panel></notice-panel>
            </el-popover>
          </el-menu-item>
          <el-menu-item index="2">
          <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
              <img src="../assets/touxiag1.gif" class="user-avatar">
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
              <el-dropdown-item divided >
                <span style="display:block;">{{this.user.name}}</span>
              </el-dropdown-item>

              <router-link to="/home">
                <el-dropdown-item>
                  Home
                </el-dropdown-item>
              </router-link>
              <el-dropdown-item divided @click.native="logout">
                <span style="display:block;" >Log Out</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          </el-menu-item>
        </el-menu>
<!--        <el-button type="info" size="mini" @click="logout">安全退出</el-button>-->
          <!-- 我的私信 -->

      </div>
    </el-header>
    <el-container >
      <!--侧边布局-->
      <el-aside :width="isCollapse ?'64px':'200px'">
        <!--伸缩按钮-->
        <div class="toggle-button" @click="toggleCollapase">|||</div>
        <!--侧边栏菜单区 unique-opened="true" 只保持一个菜单展开 router开启路由 active-text-color 颜色-->
        <el-menu background-color="rgb(48, 65, 86)" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isCollapse"
          :collapse-transition="false"  :router="true" :default-active="activePath">
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObject[item.id]"></i>
              <span>{{item.title}}</span>
            </template>
            <el-menu-item  :index="it.path+''" v-for="it in item.slist" :key="it.id"  @click="saveNavState(it.path+'')">
              <template slot="title" >
                <i :class="iconsObject[it.id]"></i>
                <span>{{it.title}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--主体布局-->
      <el-main>
          <!--路由占位符-->
        <transition name="fade-transform" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import CommonRadio from "@/components/chooseButten/CommonRadio";
import NoticePanel from "@/components/unit/NoticePanel";
export default {
  components: {CommonRadio,NoticePanel,},
    data() {
        return {
            // 左侧菜单
            menuList: [],
            iconsObject: {
              '100':'iconfont icon-yonghuguanli',
              '200':'iconfont icon-jiaoshitingkerenwuguanli',
              '300': 'iconfont icon-kecheng-copy',
              '400': 'iconfont icon-renwu',
              '101':'iconfont icon-yonghuguanli',
              '102':'iconfont icon-yonghudenglu',
              '201':'iconfont icon-renwu',
              '301':'iconfont icon-new-courses',
              '302':'iconfont icon-renwu',
              '401':'iconfont icon-renwu',
              '402':'iconfont icon-jiaoshitingkerenwuguanli'
            },
            isCollapse:false,
            // 被激活的连接
            activePath:'',
            username: '',
          user: {
          },
          noticeNum:'',
        }
    },
  // 类似onload
  created() {
      this.getUser();
      this.getMenuList();
      this.getNotice();
      this.activePath = window.sessionStorage.getItem('activePath');// 取出session里的访问路径
  },
  methods: {
    async getUser () {
      this.user = JSON.parse(window.sessionStorage.getItem('user'));
      console.log(this.user);
    },

    async getNotice() {
      const {data:res} = await this.$http.post("getNotice",this.user);
      // console.log('notice:'+res);
      this.noticeNum = res.length;
      console.log('num'+this.noticeNum)
    },

    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有的导航菜单
    async getMenuList(){
      const {data:res} = await this.$http.post("menus",this.user);
      console.log(res.data);
      if( res.status !== 200) return this.$message.error("获取导航栏失败！！！");
      this.menuList = res.data;
    },
    // 切换菜单折叠与展开
    toggleCollapase(){
      this.isCollapse = !this.isCollapse;
    },
    // 保存二级菜单的路径
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath);// 存放点击的二级菜单
      this.activePath = activePath;// 给点击的菜单添加高亮
    },
  }
};
</script>
<style lang="less" scoped>
.el-header {
  display: flex;
  justify-content: space-between;// 左右贴边
  padding-left: 0%;// 左边界
  align-items: center;// 水平
  color: #EEEEEE;
  font-size: 20px;
  height: 50px;
  overflow: hidden;
  position: relative;
  background: rgb(48, 65, 86);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  //cursor: pointer;
  > div { //左侧div加布局
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  padding-top: 0%;
  background-color: rgb(48, 65, 86);
  .el-menu{
    border-right: none;// 对其右边框
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
  transition: background .3s;
  //cursor: pointer;
}
.logo_img {
  width: 20%;
  height: 100%;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color:rgb(48, 65, 86);
  font-size: 10px;
  line-height: 24px;
  color: #EEEEEE;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;// 显示鼠标指针为：小手
}
.right-menu {
  float: right;
  height: 100%;
  line-height: 50px;

  &:focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: rgb(48, 65, 86);
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background .3s;

      &:hover {
        background: rgba(0, 0, 0, 0.02)
      }
    }
  }

  .avatar-container {
    margin-right: 30px;

    .avatar-wrapper {
      //margin-top: 0px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
.badge {
  line-height: 18px;
}
</style>
