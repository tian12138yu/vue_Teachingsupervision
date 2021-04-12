<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课表管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="25">
        <el-col :span="3">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入班级ID" v-model="classInfo.cid"  clearable @clear="getClassList">
          </el-input>
        </el-col>
        <el-col :span="3">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入院系" v-model="classInfo.department"  clearable @clear="getClassList">
          </el-input>
        </el-col>
        <el-col :span="3">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入专业" v-model="classInfo.major"  clearable @clear="getClassList">
          </el-input>
        </el-col>

        <el-col :span="2">
          <el-button type="primary" @click="getClassList">查询</el-button>
        </el-col>

        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true">添加班级</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="classList"
                element-loading-text="Loading"
                border
                stripe
                fit
                highlight-current-row>
<!--        <el-table-column type="index"></el-table-column>-->
        <el-table-column  label="班级ID" prop="cid"></el-table-column>
        <el-table-column  label="班级代称" prop="cname"></el-table-column>
        <el-table-column label="院系" prop="department"></el-table-column>
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
        <el-table-column label="操作" prop="id">
          <template slot-scope="scope" >
            <!-- 修改 -->
            <el-button type="primary" size="mini" @click="addCourse(scope.row.cname,scope.row.cid)">添加课程</el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="classInfo.pageNum"
          :page-sizes="[1, 2, 5, 100]"
          :page-size="classInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      ></el-pagination>
    </el-card>

    <!-- 创建新任务对话框 -->
    <el-dialog title="添加班级" :visible.sync="addDialogVisible" width="50%"
               @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules"
               ref="addFormRef" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="班级编码" prop="cid">
          <el-input v-model="addForm.cid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="班级代称" prop="cname">
          <el-input v-model="addForm.cname"></el-input>
        </el-form-item>
        <el-form-item label="学院" prop="department">
          <el-select v-model="addForm.department"  placeholder="请选择学院" @change="changeDepartment" style="width: 100%">
            <el-option
                v-for="item in departmentTree"
                :key="item.index"
                :label="item.name"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-select v-model="addForm.major"  placeholder="请选择专业" style="width: 100%">
            <el-option
                v-for="item in majorList"
                :key="item.index"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 内容底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click=addDialogClosed>取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @colse="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程" prop="course">
          <el-select v-model="editForm.course"  placeholder="请选择课程"  style="width: 100%">
            <el-option
                v-for="item in courseList"
                :key="item.index"
                :label="item.cname"
                :value="item.cid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClass">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 请求数据
      classInfo: {
        cid: "",
        cname: "",
        tid: "",
        departmentname: "",
        majorname: "",
        pageNum: 1,
        pageSize: 5
      },
      classList:[],//课程列表
      courseList:[],
      classTimeList:[],
      departmentTree:[],
      majorList:[],
      total: 0, // 最大数据记录
      addDialogVisible: false ,// 对话框显示
      // 添加课程表单项
      addForm: {
        cname:'',
        cid:'',
        department:'',
        major:'',
      },
      // 控制修改用户对话框显示/隐
      editDialogVisible:false,
      formVisible:false,
      // 修改用户信息
      editForm:{},
      form:{},
      // 验证规则
      addFormRules:{
        cname:[
          { required: true, message: "请输入课程名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ],
        cid:[
          { required: true, message: "请输入课程ID", trigger: "blur" },
          { min: 1, max: 15, message: "请输入正确课程ID", trigger: "blur" }
        ],
        tid:[
          { required: true, message: "请输入任课教师名", trigger: "blur" },
          { min: 1, max: 15, message: "请输入正确任课教师名", trigger: "blur" }
        ],
        start:[
          { required: true, message: "请输入开始周", trigger: "blur" },
          { min: 1, max: 2, message: "请输入正确开始周", trigger: "blur" }
        ],
        end:[
          { required: true, message: "请输入结束周", trigger: "blur" },
          { min: 1, max: 2, message: "请输入正确结束周", trigger: "blur" }
        ],
        address:[
          { required: true, message: "请输入上课地址", trigger: "blur" },
          { min: 1, max: 10, message: "请输入正确上课地址", trigger: "blur" }
        ],
        departmentname:[
          { required: true, message: "请输入院系名", trigger: "blur" },
          { min: 1, max: 10, message: "请输入正确院系名", trigger: "blur" }
        ],
        majorname:[
          { required: true, message: "请输入专业名", trigger: "blur" },
          { min: 1, max: 10, message: "请输入正确专业名", trigger: "blur" }
        ],
      },
      user:{

      },
      teacherList:[]
      // 修改用户表单验证规则
      // editFormRules:{
      //   password:[
      //     { required: true, message: "请输入密码", trigger: "blur" },
      //     { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" }
      //   ],
      //   email:[
      //     { required: true, message: "请输入邮箱", trigger: "blur" },
      //     { min: 5, max: 15, message: "请输入正确邮箱地址", trigger: "blur" }
      //   ],
      // },
    };
  },
  created() {
    this.getClassList();
    this.getDepartList();
  },
  methods: {
    async getDepartList(){
      const { data: res } = await this.$http.get("init")
      console.log(res);
      debugger;
      this.departmentTree = res.trees;
      this.classTimeList = res.classList;
    },
    getUser () {
      this.user = JSON.parse(window.sessionStorage.getItem('user'));
      console.log(this.user.username);
    },
    async getClassList() {
      // 调用get请求
      const { data: res } = await this.$http.get("getClassListByInfo", {
        params: this.classInfo
      });
      debugger;
      this.classList = res.data; // 将返回数据赋值
      this.total = res.count; // 总个数
    },

    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.classInfo.pageSize = newSize;
      this.getClassList(); // 数据发生改变重新申请数据
    },
    // 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      this.classInfo.pageNum = newPage;
      this.getClassList(); // 数据发生改变重新申请数据
    },
    changeDepartment(val) {
      this.addForm.majorname = '';
      this.addForm.department = val.name;
      this.majorList = val.major;
      console.log(val);
      console.log(this.majorList);
    },
    // 监听添加用户
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();// 重置表单项
      this.addDialogVisible = false;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();// 重置表单项
    },
    async editClass() {
      const {data:res} = await this.$http.get("/insertClassCourse?courseId="+
          this.editForm.course+"&classId="+this.editForm.classId);
      console.log(res);
      this.editDialogVisible = false;
      this.$refs.editFormRef.resetFields();// 重置表单项
      this.getClassList();
    },
    // 添加用户
    addUser(){
      this.$refs.addFormRef.validate(async valid =>{
        console.log(valid);
        if( !valid ) return;
        // 发起请求
        const {data:res} = await this.$http.post("addClass",this.addForm);
        if (res !== "success") {
          return this.$message.error("操作失败！！！");
        }
        this.$message.success("操作成功！！！");
        //隐藏
        this.addDialogVisible = false;
        await this.getClassList();
        this.$refs.addFormRef.resetFields();// 重置表单项
      })
    },
    async addCourse(cname,cid) {
      const { data: res } = await this.$http.get("getCourseWithout?cid="+cid)
      this.editForm.name = cname;
      this.editForm.classId = cid;
      this.editDialogVisible = true;
      this.courseList = res;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
