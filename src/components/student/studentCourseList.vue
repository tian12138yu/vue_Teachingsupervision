<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的任务</el-breadcrumb-item>
      <el-breadcrumb-item>任务列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 用户列表 -->
      <el-table :data="studentCourseList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="课程ID" prop="cid"></el-table-column>
        <el-table-column label="课程名" prop="cname"></el-table-column>
        <el-table-column label="代课老师" prop="tid"></el-table-column>
        <el-table-column label= "评价" >
          <template slot-scope="scope">
            <router-link :to = "`/sEvaluation`">
              <el-button type="primary" size= mini>评价</el-button>
            </router-link>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      studentCourseList: [],// 用户列表
      user:{},
      total: 0, // 最大数据记录
    }
  },
  created() {
    this.getUser();
    this.getStudentList();
  },
  methods:{
    getUser () {
      this.user = JSON.parse(window.sessionStorage.getItem('user'));
      console.log(this.user.username);
    },
    async getStudentList() {
      const { data: res } = await this.$http.get("getStudentCourse?id="+this.user.id);
      this.studentCourseList = res; // 将返回数据赋值
    },
  }

}
</script>
<style lang="less" scoped>
.el-row .el-col:nth-of-type(odd){//odd为奇数列，even为偶数列
  justify-content: flex-end;
}
</style>
