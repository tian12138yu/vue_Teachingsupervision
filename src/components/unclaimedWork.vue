<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的任务</el-breadcrumb-item>
      <el-breadcrumb-item>未分配任务</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="25">
        <el-col :span="10">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getWorkList">
            <el-button slot="append" icon="el-icon-search" @click="getWorkList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="worklist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="任务号" prop="id"></el-table-column>
        <el-table-column label="任务简介" prop="wname"></el-table-column>
        <el-table-column label="任务时间" prop="time"></el-table-column>
        <el-table-column label="代课老师" prop="tname"></el-table-column>
        <el-table-column label="听课时间" prop="creatime"></el-table-column>
        <el-table-column label="课程号" prop="cid"></el-table-column>
        <el-table-column label="课程名称" prop="cname">
        </el-table-column>
        <el-table-column label="操作" prop="id">
          <template slot-scope="scope" >
            <el-button type="primary"  size="mini" @click="receiveWork(scope.row.id)">领取任务</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNum"
          :page-sizes="[1, 2, 5, 100]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 请求数据
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 5
      },
      worklist: [],// 用户列表
      total: 0, // 最大数据记录
      addDialogVisible: false ,// 对话框显示
      // 添加用户表单项
      addForm: {
        id:'',
        wname:'',
        time:'',
        cid:'',
        tid: '',
        creatime:'',
        formid:'',
       isfinished:''
      },
      // 控制修改用户对话框显示/隐藏
      editDialogVisible:false,
      formVisible:false,
      // 修改用户信息
      editForm:{},
      form:{},
      // 验证规则
      user:{
      },
    };
  },
  created() {
    this.getUser();
    this.getWorkList();
  },
  methods: {
    getUser () {
      this.user = JSON.parse(window.sessionStorage.getItem('user'));
      console.log(this.user.username);
    },
    async getWorkList() {
      // 调用get请求
      const { data: res } = await this.$http.get("getNoWorks", {
        params: this.queryInfo
      });
      this.worklist = res.data; // 将返回数据赋值
      this.total = res.numbers; // 总个数
    },

    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getWorkList(); // 数据发生改变重新申请数据
    },
    // 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getWorkList(); // 数据发生改变重新申请数据
    },

    // 关闭窗口
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
  //领取任务
    async receiveWork(id){
      // 弹框
      const confirmResult = await this.$confirm('是否领取改任务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 成功删除为confirm 取消为 cancel
      if(confirmResult!='confirm'){
        return this.$message.info("已取消");
      }
      const {data:res} = await this.$http.get("receiveWork?id="+id+"&name="+
          this.user.name+"&userId="+this.user.id);
      if (res != "success") {
        return this.$message.error(res);
      }
      this.$message.success("领取成功！！！");
      this.getWorkList();
    },
  }
};
</script>
<style lang="less" scoped>
</style>
