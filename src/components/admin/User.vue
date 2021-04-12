<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="25">
        <el-col :span="10">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->

      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="登录名" prop="username"></el-table-column>
        <el-table-column label="手机号" prop="phone"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="角色" prop="role" :formatter="roleFormat"></el-table-column>
        <el-table-column label="学院" prop="department"></el-table-column>
        <el-table-column label="状态" prop="state">
          <!-- scope.row 就是当前行的信息 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
<!--            &lt;!&ndash; 权限 &ndash;&gt;-->
<!--            <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false">-->
<!--              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>-->
<!--            </el-tooltip>-->
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

    <!-- 创建新用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%"
    @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules"
        ref="addFormRef" label-width="70px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="role">
          <el-select v-model="addForm.role" placeholder="请选择">
            <el-option label="督导员" value="0"> </el-option>
            <el-option label="教师" value="2"> </el-option>
            <el-option label="学生" value="3"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学院" prop="department">
          <el-select v-model="addForm.department"  placeholder="请选择学院"  style="width: 100%">
            <el-option
                v-for="item in departmentTree"
                :key="item.index"
                :label="item.name"
                :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 内容底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @colse="editDialogClosed">
       <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <!-- 用户名 -->
         <el-form-item label="姓名" prop="name">
           <el-input v-model="editForm.name" disabled></el-input>
         </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
         <el-form-item label="学院" prop="department">
           <el-select v-model="editForm.department"  placeholder="请选择学院"  style="width: 100%">
             <el-option
                 v-for="item in departmentTree"
                 :key="item.index"
                 :label="item.name"
                 :value="item.name">
             </el-option>
           </el-select>
         </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
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
      userlist: [],// 用户列表
      departmentTree:[],
      total: 0, // 最大数据记录
      addDialogVisible: false ,// 对话框显示
      // 添加用户表单项
      addForm: {
        name:'',
        username:'',
        password:'',
        phone:'',
        role:'',
        department:''
      },
      // 控制修改用户对话框显示/隐藏
      editDialogVisible:false,
      // 修改用户信息
      editForm:{},
      // 验证规则
      addFormRules:{
        name:[
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 1, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ],
        username:[
           { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 1, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" }
        ],
        password:[
           { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" }
        ],
        phone:[
           { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确手机号", trigger: "blur" }
        ],
      },
      // 修改用户表单验证规则
      editFormRules:{
        name:[
          { required: true, message: "姓请输入姓名", trigger: "blur" },
          { min: 1, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ],
        username:[
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 1, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" }
        ],
          password:[
           { required: true, message: "请输入密码", trigger: "blur" },
           { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" }
          ],
          phone:[
           { required: true, message: "请输入手机号", trigger: "blur" },
           { min: 11, max: 11, message: "请输入正确手机号", trigger: "blur" }
          ],
      },
    };
  },
  created() {
    this.getUserList();
    this.getDepartList();
  },
  methods: {
    async getDepartList(){
      const { data: res } = await this.$http.get("init")
      console.log(res);
      debugger;
      this.departmentTree = res.trees;
    },
    async getUserList() {
      // 调用post请求
      const { data: res } = await this.$http.get("allUser", {
        params: this.queryInfo
      });
      this.userlist = res.data; // 将返回数据赋值
      this.total = res.numbers; // 总个数
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getUserList(); // 数据发生改变重新申请数据
    },
    // 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getUserList(); // 数据发生改变重新申请数据
    },
    // 修改用户状态
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(
        `userState?id=${userinfo.id}&state=${userinfo.state}`
      );
      if (res != "success") {
        userinfo.state = !userinfo.state;
        return this.$message.error("操作失败！！！");
      }
      this.$message.success("操作成功！！！");
    },
    // 监听添加用户
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();// 重置表单项
    },
    // 添加用户
    addUser(){
        this.$refs.addFormRef.validate(async valid =>{
        console.log(valid);
        if( !valid ) return;
        // 发起请求
        const {data:res} = await this.$http.post("addUser",this.addForm);
        if (res != "success") {
        userinfo.state = !userinfo.state;
        return this.$message.error("操作失败！！！");
        }
        this.$message.success("操作成功！！！");
        //隐藏
        this.addDialogVisible = false;
        this.getUserList();
      })
    },
    // 展示修改框
    async showEditDialog(id){

        const {data:res} = await this.$http.get("getUpdate?id="+id);
        // if (res != "success") {
        // userinfo.state = !userinfo.state;
        // return this.$message.error("操作失败！！！");
        // }
        // this.$message.success("操作成功！！！");

        this.editForm = res;
        this.editDialogVisible = true;
    },
    // 关闭窗口
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    // 确认修改
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid =>{
        console.log(valid);
        if( !valid ) return;
        // 发起请求
        const {data:res} = await this.$http.put("editUser",this.editForm);
        console.log(res);
         if (res != "success") return this.$message.error("操作失败！！！");
        this.$message.success("操作成功！！！");
        //隐藏
        this.editDialogVisible = false;
        this.getUserList();
      });
    },
    roleFormat(row){
      // console.log("row="+row.isfinished);
      if (row.role === '0') {
        return '督导';
      }
      else if (row.role === '1') {
        return '管理员';
      }
      else if (row.role === '2') {
        return '教师';
      }else if (row.role === '3') {
        return '学生';
      }else if (row.role === '4') {
        return '院级领导';
      }
    },
    // 删除按钮
    async deleteUser(id){
      // 弹框
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      // 成功删除为confirm 取消为 cancel
      if(confirmResult!='confirm'){
        return this.$message.info("已取消删除");
      }
      const {data:res} = await this.$http.delete("deleteUser?id="+id);
      if (res != "success") {
        return this.$message.error("操作失败！！！");
      }
      this.$message.success("操作成功！！！");
      this.getUserList();
    },
  }
};
</script>
<style lang="less" scoped>
</style>
