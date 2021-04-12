<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="25">
        <el-col :span="3">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入学生学号" v-model="studentInfo.sid"  clearable @clear="getStudentList">
          </el-input>
        </el-col>
        <el-col :span="3">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入学生姓名" v-model="studentInfo.name" clearable @clear="getStudentList">
            <!--            <el-button slot="append" icon="el-icon-search" @click="getStudentList"></el-button>-->
          </el-input>
        </el-col>
        <el-col :span="3">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入学生班级号" v-model="studentInfo.cid" clearable @clear="getStudentList">
            <!--            <el-button slot="append" icon="el-icon-search" @click="getStudentList"></el-button>-->
          </el-input>
        </el-col>
        <el-col :span="3">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入学生院系" v-model="studentInfo.department" clearable @clear="getStudentList">
            <!--            <el-button slot="append" icon="el-icon-search" @click="getStudentList"></el-button>-->
          </el-input>
        </el-col>
        <el-col :span="3">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入学生专业" v-model="studentInfo.major" clearable @clear="getStudentList">
            <!--            <el-button slot="append" icon="el-icon-search" @click="getStudentList"></el-button>-->
          </el-input>
        </el-col>

        <el-col :span="4" >
          <el-button  type="primary" @click="getStudentList">查找</el-button>
        </el-col>

        <el-col :span="4"  >
          <el-button  type="primary" @click="addStudentOpen">添加学生</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="学号" prop="sid"></el-table-column>
        <el-table-column label="登录名" prop="username"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="班级号" prop="cid"></el-table-column>
        <el-table-column label="班级简称" prop="cname" ></el-table-column>
        <el-table-column label="学院" prop="department"></el-table-column>
        <el-table-column label="专业" prop="major"></el-table-column>
        <el-table-column label="课程"
                         width="240"
                         align="left">
          <template slot-scope="scope">
            <div>
              <ul>
                <li v-for="item in scope.row.courseList">
                  {{ item.cname }}
                </li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.sid)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.sid)"></el-button>

<!--            <el-button type="primary" icon="el-icon-circle-plus" size="mini" @click="deleteUser(scope.row.id)">添加课程</el-button>-->

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
        :current-page="studentInfo.pageNum"
        :page-sizes="[1, 2, 5, 100]"
        :page-size="studentInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

    </el-card>

    <!-- 创建新用户对话框 -->
    <el-dialog title="添加学生" :visible.sync="addDialogVisible" width="50%"
    @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules"
        ref="addFormRef" label-width="70px">
        <el-form-item label="学号" prop="sid">
          <el-input v-model="addForm.sid"></el-input>
        </el-form-item>
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
        <el-form-item label="班级号" prop="cid">
          <el-select v-model="addForm.cid"  placeholder="请选择班级号"  @change="changeClass" style="width: 100%">
            <el-option
                v-for="item in classList"
                :key="item.index"
                :label="item.cid"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="班级简称" prop="cname">
          <el-input v-model="addForm.cname" disabled></el-input>
        </el-form-item>
        <el-form-item label="学院" prop="department">
          <el-input v-model="addForm.department" disabled></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="addForm.major" disabled></el-input>
        </el-form-item>
      </el-form>
      <!-- 内容底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStudent">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @colse="editDialogClosed">
       <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
         <el-form-item label="学号" prop="sid">
           <el-input v-model="editForm.sid" disabled></el-input>
         </el-form-item>
         <el-form-item label="姓名" prop="name">
           <el-input v-model="editForm.name" disabled></el-input>
         </el-form-item>
         <!-- 用户名 -->
         <el-form-item label="用户名" prop="username">
           <el-input v-model="editForm.username"></el-input>
         </el-form-item>
         <!-- 密码 -->
         <el-form-item label="密码" prop="password">
           <el-input v-model="editForm.password"></el-input>
         </el-form-item>
         <!-- 手机号 -->
         <el-form-item label="班级号" prop="cid">
           <el-select v-model="editForm.cid"  placeholder="请选择班级号"  @change="changeClass1" style="width: 100%">
             <el-option
                 v-for="item in classList"
                 :key="item.index"
                 :label="item.cid"
                 :value="item">
             </el-option>
           </el-select>
         </el-form-item>

         <el-form-item label="班级简称" prop="cname">
           <el-input v-model="editForm.cname" disabled></el-input>
         </el-form-item>
         <el-form-item label="学院" prop="department">
           <el-input v-model="editForm.department" disabled></el-input>
         </el-form-item>
         <el-form-item label="专业" prop="major">
           <el-input v-model="editForm.major" disabled></el-input>
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
      radio:"1",
      // 请求数据
      studentInfo: {
        name:null,
        sid:null,
        cid:null,
        department:null,
        major:null,
        pageNum: 1,
        pageSize: 5
      },
      userlist: [],// 用户列表
      CourseList:[],
      classList:[],
      total: 0, // 最大数据记录
      addDialogVisible: false ,// 对话框显示
      // 添加用户表单项
      addForm: {
        name:'',
        username:'',
        password:'',
        cid:'',
        cname:'',
        department:'',
        major:'',
        sid:'',

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
          { min: 1, max: 20, message: "长度在 5 到 8 个字符", trigger: "blur" }
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
    this.getStudentList();
    // this.getClassList();
  },
  methods: {

    async getStudentList() {
      // 调用post请求
      const { data: res } = await this.$http.get("getAllStudent", {
        params: this.studentInfo
      });
      this.userlist = res.data; // 将返回数据赋值
      this.total = res.count;
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.studentInfo.pageSize = newSize;
      this.getUserList(); // 数据发生改变重新申请数据
    },
    // 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      this.studentInfo.pageNum = newPage;
      this.getUserList(); // 数据发生改变重新申请数据
    },
    async getClassList() {
      const { data: res } = await this.$http.get("getClassList");
      console.log(res);
      this.classList = res;

    },
    addStudentOpen() {
      this.getClassList();
      this.addDialogVisible = true
    },
    // 监听添加用户
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();// 重置表单项
    },
    changeClass(val) {
      this.addForm.cid = val.cid;
      this.addForm.cname = val.cname;
      this.addForm.department = val.department;
      this.addForm.major = val.major;
      console.info(val);
    },
    changeClass1(val) {
      this.editForm.cid = val.cid;
      this.editForm.cname = val.cname;
      this.editForm.department = val.department;
      this.editForm.major = val.major;
      console.info(val);
    },
    // 添加用户
    addStudent(){
        this.$refs.addFormRef.validate(async valid =>{
        console.log(valid);
        if( !valid ) return;
        // 发起请求
        const {data:res} = await this.$http.post("addStudent",this.addForm);
        if (res !=="success") {
        userinfo.state = !userinfo.state;
        return this.$message.error("操作失败！！！");
        }
        this.$message.success("操作成功！！！");
        //隐藏
        this.addDialogVisible = false;
        this.getStudentList();
      })
    },
    // 展示修改框
    async showEditDialog(id){
        this.getClassList();
        const {data:res} = await this.$http.get("getUpdateStudent?sid="+id);
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
        const {data:res} = await this.$http.put("editStudent",this.editForm);
        console.log(res);
         if (res != "success") return this.$message.error("操作失败！！！");
        this.$message.success("操作成功！！！");
        //隐藏
        this.editDialogVisible = false;
        this.getStudentList();
      });
    },
    // 删除按钮
    async deleteUser(sid){
      // 弹框
      const confirmResult = await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      // 成功删除为confirm 取消为 cancel
      if(confirmResult!='confirm'){
        return this.$message.info("已取消");
      }
      const {data:res} = await this.$http.delete("deleteStudent?sid="+sid);
      if (res != "success") {
        return this.$message.error("操作失败！！！");
      }
      this.$message.success("操作成功！！！");
      this.getStudentList();
    },
  }
};
</script>
<style lang="less" scoped>
.el-row .el-col:nth-of-type(odd){//odd为奇数列，even为偶数列
  justify-content: flex-end;
}
</style>
