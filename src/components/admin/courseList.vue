<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课表管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="25">
        <el-col :span="3">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入课程ID" v-model="courseInfo.cid"  clearable @clear="getCourseList">
          </el-input>
        </el-col>
        <el-col :span="3">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入课程名" v-model="courseInfo.cname"  clearable @clear="getCourseList">
          </el-input>
        </el-col>
        <el-col :span="3">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入代课老师" v-model="courseInfo.tid"  clearable @clear="getCourseList">
          </el-input>
        </el-col>
        <el-col :span="3">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入院系" v-model="courseInfo.departmentname"  clearable @clear="getCourseList">
          </el-input>
        </el-col>
        <el-col :span="3">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入专业" v-model="courseInfo.majorname"  clearable @clear="getCourseList">
          </el-input>
        </el-col>

        <el-col :span="2">
          <el-button type="primary" @click="getCourseList">查询</el-button>
        </el-col>

        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true">添加课程</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="courseList"
                element-loading-text="Loading"
                border
                stripe
                fit
                highlight-current-row>
<!--        <el-table-column type="index"></el-table-column>-->
        <el-table-column fixed label="课程ID" prop="cid"></el-table-column>
        <el-table-column fixed label="课程名" prop="cname"></el-table-column>
        <el-table-column label="代课老师" prop="tid"></el-table-column>
        <el-table-column label="周一" prop="time1">
          <template slot-scope="scope">
            {{ scope.row.time1 === undefined || scope.row.isfinished === '' ? '无' : scope.row.time1 }}
          </template>
        </el-table-column>
        <el-table-column label="周二" prop="time2">
          <template slot-scope="scope">
            {{ scope.row.time2 === undefined || scope.row.isfinished === '' ? '无' : scope.row.time2 }}
          </template>
        </el-table-column>
        <el-table-column label="周三" prop="time3">
          <template slot-scope="scope">
            {{ scope.row.time3 === undefined || scope.row.isfinished === "" ? '无' : scope.row.time3 }}
          </template>
        </el-table-column>
        <el-table-column label="周四" prop="time1">
          <template slot-scope="scope">
            {{ scope.row.time4 === undefined || scope.row.isfinished === null ? '无' : scope.row.time4 }}
          </template>
        </el-table-column>
        <el-table-column label="周五" prop="time1">
          <template slot-scope="scope">
            {{ scope.row.time5 === undefined || scope.row.isfinished === '' ? '无' : scope.row.time5}}
          </template>
        </el-table-column>
        <el-table-column label="上课地点" prop="address"></el-table-column>
        <el-table-column label="开始周" prop="start"></el-table-column>
        <el-table-column label="结束周" prop="end"></el-table-column>
        <el-table-column label="院系" prop="departmentname"></el-table-column>
        <el-table-column label="专业" prop="majorname"></el-table-column>
        <el-table-column label= "历史评价" prop="" >
<!--          <template slot-scope="scope">-->
            <el-popover
                placement="left"
                width="350"
                slot-scope="scope"
                trigger="click">
              <el-table :data="gridData" width="50%">
                <el-table-column  property="createtime" label="日期"></el-table-column>
                <el-table-column  property="summary" label="评价"></el-table-column>
              </el-table>
              <el-button slot="reference" type="mini" @click="getHistory(scope.row.cname)">查看</el-button>
            </el-popover>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="courseInfo.pageNum"
          :page-sizes="[1, 2, 5, 100]"
          :page-size="courseInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      ></el-pagination>
    </el-card>

    <!-- 创建新任务对话框 -->
    <el-dialog title="添加课程" :visible.sync="addDialogVisible" width="50%"
               @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules"
               ref="addFormRef" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="课程编号" prop="cid">
          <el-input v-model="addForm.cid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="课程名" prop="cname">
          <el-input v-model="addForm.cname"></el-input>
        </el-form-item>
        <el-form-item label="教师名" prop="tid">
          <el-select v-model="addForm.tid"  placeholder="请选择教师名" style="width: 100%">
            <el-option
                v-for="item in teacherList"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周一" prop="time1">
        <el-select v-model="addForm.time1"  placeholder="请选择周一上课时间"  style="width: 100%">
            <el-option
                v-for="item in classTimeList"
                :key="item.index"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周二" prop="time2">
          <el-select v-model="addForm.time2"  placeholder="请选择周二上课时间"  style="width: 100%">
            <el-option
                v-for="item in classTimeList"
                :key="item.index"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周三" prop="time3">
          <el-select v-model="addForm.time3"  placeholder="请选择周三上课时间"  style="width: 100%">
            <el-option
                v-for="item in classTimeList"
                :key="item.index"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周四" prop="time4">
          <el-select v-model="addForm.time4"  placeholder="请选择周四上课时间"  style="width: 100%">
            <el-option
                v-for="item in classTimeList"
                :key="item.index"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周五" prop="time5">
          <el-select v-model="addForm.time5"  placeholder="请选择周五上课时间"  style="width: 100%">
            <el-option
                v-for="item in classTimeList"
                :key="item.index"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始周" prop="start">
          <el-input v-model="addForm.start"></el-input>
        </el-form-item>
        <el-form-item label="结束周" prop="end">
          <el-input v-model="addForm.end"></el-input>
        </el-form-item>
        <el-form-item label="学院" prop="departmentname">
          <el-select v-model="addForm.departmentname"  placeholder="请选择学院" @change="changeDepartment" style="width: 100%">
            <el-option
                v-for="item in departmentTree"
                :key="item.index"
                :label="item.name"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业" prop="majorname">
          <el-select v-model="addForm.majorname"  placeholder="请选择专业" style="width: 100%">
            <el-option
                v-for="item in majorList"
                :key="item.index"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课地址" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
      </el-form>
      <!-- 内容底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click=addDialogClosed>取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 请求数据
      courseInfo: {
        cid: "",
        cname: "",
        tid: "",
        departmentname: "",
        majorname: "",
        pageNum: 1,
        pageSize: 5
      },
      courseList:[],//课程列表
      departmentTree:[
      ],
      classTimeList:[],
      majorList:[],
      total: 0, // 最大数据记录
      addDialogVisible: false ,// 对话框显示
      // 添加课程表单项
      addForm: {
        cname:'',
        cid:'',
        tid:'',
        time1: '',
        time2: '',
        time3: '',
        time4: '',
        time5: '',
        start:'',
        end:'',
        departmentname:'',
        majorname:'',
        address:'',
      },
      // 控制修改用户对话框显示/隐藏
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
      teacherList:[],
      gridData: [],
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
    this.getCourseList();
    this.getTeacherList();
    this.getDepartList();
    // this.getUser();
  },
  methods: {
    async getDepartList(){
      const { data: res } = await this.$http.get("init")
      console.log(res);

      this.departmentTree = res.trees;
      this.classTimeList = res.classList;
    },
    async getTeacherList(){
      const { data: res } = await this.$http.get("getTeacherList")
      console.log(res);
      this.teacherList = res;
    },
    getUser () {
      this.user = JSON.parse(window.sessionStorage.getItem('user'));
      console.log(this.user.username);
    },
    async getCourseList() {
      // 调用get请求
      const { data: res } = await this.$http.get("getCourseList", {
        params: this.courseInfo
      });
      this.courseList = res.data; // 将返回数据赋值
      this.total = res.numbers; // 总个数
    },

    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.courseInfo.pageSize = newSize;
      this.getCourseList(); // 数据发生改变重新申请数据
    },
    // 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      this.courseInfo.pageNum = newPage;
      this.getCourseList(); // 数据发生改变重新申请数据
    },
    changeDepartment(val) {
      this.addForm.majorname = '';
      this.addForm.departmentname = val.name;
      this.majorList = val.major;
      console.log(val);
      console.log(this.majorList);

    },
    // 监听添加用户
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();// 重置表单项
      this.addDialogVisible = false;
    },
    // 添加用户
    addUser(){
      this.$refs.addFormRef.validate(async valid =>{
        console.log(valid);
        if( !valid ) return;
        // 发起请求
        const {data:res} = await this.$http.post("addCourse",this.addForm);
        if (res !== "success") {
          userinfo.state = !userinfo.state;
          return this.$message.error("操作失败！！！");
        }
        this.$message.success("操作成功！！！");
        //隐藏
        this.addDialogVisible = false;
        this.getCourseList();
        this.$refs.addFormRef.resetFields();// 重置表单项
      })
    },
    async getHistory(cname) {
      debugger;
      const { data: res } = await this.$http.get("getHistory?cname="+cname)
      this.gridData = res;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
