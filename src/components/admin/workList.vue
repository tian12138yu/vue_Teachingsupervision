<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>听课管理</el-breadcrumb-item>
      <el-breadcrumb-item>任务列表</el-breadcrumb-item>
    </el-breadcrumb>
    <template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部任务" name="first"  >全部任务</el-tab-pane>
        <el-tab-pane label="已完成" name="second" >已完成</el-tab-pane>
        <el-tab-pane label="未完成" name="third" >未完成</el-tab-pane>
      </el-tabs>
    </template>
    <!-- 卡片视图区 -->

    <el-card>
      <el-row :gutter="25">
        <el-col :span="3">
          <el-input placeholder="请输入任务简介" v-model="workInfo.wname" clearable @clear="getWorkList">
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input placeholder="请输入课程名" v-model="workInfo.cname" clearable @clear="getWorkList">
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input placeholder="请输入课程号" v-model="workInfo.cid" clearable @clear="getWorkList">
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input placeholder="请输入听课老师名" v-model="workInfo.ownerName" clearable @clear="getWorkList">
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input placeholder="请输入代课老师" v-model="workInfo.tname" clearable @clear="getWorkList">
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-input placeholder="请输入听课周" v-model="workInfo.week" clearable @clear="getWorkList">
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="getWorkList">查询</el-button>
        </el-col>

        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true">添加任务</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="worklist" border stripe v-loading="loading">
<!--        <el-table-column label="任务号" prop="id"></el-table-column>-->
        <el-table-column label="任务简介" prop="wname"></el-table-column>
        <el-table-column fixed label="课程号" prop="cid"></el-table-column>
        <el-table-column fixed label="课程名称" prop="cname">
        </el-table-column>
        <el-table-column label="代课老师" prop="tname"></el-table-column>
        <el-table-column label="听课周次" prop="week"></el-table-column>
        <el-table-column label="听课时间" prop="time"></el-table-column>
        <el-table-column label="听课地点" prop="address"></el-table-column>
        <el-table-column label="听课老师" prop="ownerName"></el-table-column>
        <el-table-column label="创建时间" prop="creatime"></el-table-column>
        <el-table-column label="状态" prop="isfinished" :formatter="stateFormat">
        </el-table-column>
          <el-table-column label="设计" prop="">
            <template slot-scope="scope">
              <el-button type=" success" size= mini  :disabled= "scope.row.formid !== 0"
                         @click="$router.push({path:'/newForm',query:{wid:scope.row.id,name:scope.row.wname,cname:scope.row.cname}})">设计反馈表</el-button>
            </template>
          </el-table-column>

        <el-table-column label= "反馈表" prop="formid">
	        <template slot-scope="scope">
            <el-button type=" success" size= mini :disabled= "scope.row.formid === 0" @click="showEditForm(scope.row.formid)">查看反馈表</el-button>
            </template>
        </el-table-column>

        <el-table-column label="操作" prop="id">
          <template slot-scope="scope" >
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteWork(scope.row.id)"></el-button>

            <el-button type="warning" icon="el-icon-setting" size="mini" :disabled= "scope.row.isfinished !== 2"
                       @click="distribution(scope.row.id)">分配</el-button>

          </template>
        </el-table-column>


      </el-table>
      <!-- 分页 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="workInfo.pageNum"
          :page-sizes="[1, 2, 5, 100]"
          :page-size="workInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      ></el-pagination>
    </el-card>

    <!-- 创建新用户对话框 -->
    <el-dialog title="添加任务" :visible.sync="addDialogVisible" width="50%"
               @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules"
               ref="addFormRef" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="任务简介" prop="wname">
          <el-input v-model="addForm.wname"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="课程名" prop="cname">
          <el-select v-model="addForm.cname"  @change="changeFenqiRate" placeholder="请选择课程名" style="width: 100%">
            <el-option
                v-for="(item) in course"
                :key="item.cname"
                :label="item.cname"
                :value="item.cname">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="课程号" prop="cid">
          <el-input v-model="addForm.cid" disabled></el-input>
        </el-form-item>
        <el-form-item label="听课地址" prop="address">
          <el-input v-model="addForm.address" disabled></el-input>
        </el-form-item>

        <el-form-item label="听课老师（选填）" prop="tid">
          <el-select v-model="addForm.ownerName"  @change="change" placeholder="请选择教师名" style="width: 100%">
            <el-option
                v-for="item in teacherList"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="听课周次" prop="week">
          <el-select v-model="addForm.week"  placeholder="请选择周次" style="width: 100%">
            <el-option
                v-for="item in weeks"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="听课时间" prop="time">
          <el-select v-model="addForm.time"  placeholder="请选择听课时间" style="width: 100%">
            <el-option
                v-for="item in timeList"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 内容底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addQuxiao">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改任务信息" :visible.sync="editDialogVisible" width="50%" @colse="editDialogClosed">
      <el-form :model="editForm" label-width="70px" ref="editFormRef">
        <!-- 密码 -->
        <el-form-item label="任务简介" prop="wname">
          <el-input v-model="editForm.wname"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="听课老师" prop="tid">
          <el-select v-model="editForm.ownerName" placeholder="请选择教师名" style="width: 100%">
            <el-option
                v-for="item in teacherList"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程名" prop="cname" >
          <el-input v-model="editForm.cname" disabled></el-input>
        </el-form-item>
        <el-form-item label="听课时间" prop="time">
          <el-select v-model="editForm.time"  placeholder="请选择听课时间" style="width: 100%">
            <el-option
                v-for="item in editTimeList"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="听课周次" prop="week">
          <el-select v-model="editForm.week"  placeholder="请选择周次" style="width: 100%">
            <el-option
                v-for="item in editWeeks"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配任务" :visible.sync="fenDialogVisible" width="50%" @colse="editDialogClosed">
      <el-form :model="fenForm" :rules="fenFormRules" ref="fenForm" label-width="70px">
        <!-- 密码 -->
        <el-form-item label="任务简介" prop="wname">
          <el-input v-model="fenForm.wname" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程名" prop="cname" >
          <el-input v-model="fenForm.cname" disabled></el-input>
        </el-form-item>
        <el-form-item label="听课老师" prop="tid">
          <el-select v-model="fenForm.ownerName"  placeholder="请选择教师名" style="width: 100%">
            <el-option
                v-for="item in teacherList"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fenDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="fenWorkInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--显示具体的反馈单-->
    <el-dialog title="反馈单" :visible.sync="formVisible" width="50%" @colse="editDialogClosed"
               centerdestroy-on-close = "true">
      <el-form :model="form"  ref="editFormRef" label-width="70px" label-position=top>
        <el-form-item label='任务号' prop="wid"  >
          <el-input v-model="form.wid"></el-input>
        </el-form-item>

        <el-form-item label='课程号' prop="cid">
          <el-input v-model="form.cid"></el-input>
        </el-form-item>

        <el-form-item label='院系' prop="departmentname"  >
          <el-input v-model="form.departmentname"></el-input>
        </el-form-item>
        <el-form-item label='创建时间' prop="createtime" disabled="true" >
          <el-input v-model="form.createtime"></el-input>
        </el-form-item>

        <el-form-item :label=this.form.entry1 v-if="form.entry1 !== undefined" prop="evaluate1"  >
          <el-input v-model="form.evaluate1"></el-input>
        </el-form-item>
        <el-form-item :label=this.form.entry2 v-if="form.entry2 !== undefined" prop="evaluate2"  >
          <el-input v-model="form.evaluate2"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item :label=this.form.entry3 v-if="form.entry3 !== undefined" prop="evaluate3"  >
        <el-input v-model="form.evaluate3"></el-input>
        </el-form-item>
        <el-form-item :label=this.form.entry4 v-if="form.entry4 !== undefined" prop="evaluate4"  >

        <el-input v-model="form.evaluate4"></el-input>
        </el-form-item>
        <el-form-item :label=this.form.entry5 v-if="form.entry5 !== undefined" prop="evaluate5"  >

        <el-input v-model="form.evaluate5"></el-input>
        </el-form-item>
        <el-form-item :label=this.form.entry6 v-if="form.entry6 !== undefined" prop="evaluate6"  >

        <el-input v-model="form.evaluate6"></el-input>
        </el-form-item>
        <el-form-item :label=this.form.entry7 v-if="form.entry7 !== undefined" prop="evaluate7"  >

        <el-input v-model="form.evaluate7"></el-input>
        </el-form-item>
        <el-form-item :label=this.form.entry8 v-if="form.entry8 !== undefined" prop="evaluate8"  >

        <el-input v-model="form.evaluate8"></el-input>
        </el-form-item>
        <el-form-item :label=this.form.entry9 v-if="form.entry9 !== undefined" prop="evaluate9"  >

        <el-input v-model="form.evaluate9"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="formVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 请求数据
      workInfo: {
        wname: '',
        tname: '',
        ownerName: '',
        cname: '',
        cid:'',
        week: '',
        tid:'',
        isfinished: '',
        pageNum: 1,
        pageSize: 5
      },
      loading: true,
      activeName: 'first',
      userlist: [],// 用户列表
      worklist: [],// 用户列表
      course: [],
      weeks:[],//周次
      timeList: [],//听课时间
      editWeeks:[],//周次
      editTimeList: [],//听课时间
      teacherList:[],
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
        ownerName:'',
        tname:'',
        address:'',
        isfinished:'2',
        week: '',
      },
      // 控制修改用户对话框显示/隐藏
      editDialogVisible:false,
      fenDialogVisible:false,
      formVisible:false,
      // 修改用户信息
      editForm:{},
      fenForm:{},
      form:{},
      // 验证规则
      addFormRules:{
        wname:[
          { required: true, message: "请输入任务简介", trigger: "blur" },
          { min: 5, max: 20, message: "长度在 5 到 20 个字符", trigger: "blur" }
        ],
        time:[
          { required: true, message: "请输入听课时间", trigger: "blur" },
          { min: 1, max: 100, message: "请输入正确听课时间", trigger: "blur" }
        ],
        cname:[
          { required: true, message: "请选择课程", trigger: "blur" },
          { min: 1, max: 100, message: "请选择正确的课程", trigger: "blur" }
        ],

      },
      fenFormRules:{
        wname:[
          { required: true, message: "请输入任务简介", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" }
        ],
        time:[
          { required: true, message: "请输入听课时间", trigger: "blur" },
          { min: 1, max: 100, message: "请输入正确听课时间", trigger: "blur" }
        ],
      },

      user:{

      }
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
    this.getWorkList();
    this.getUser();
    this.getCourseMap();
    this.getTeacherList();
  },
  methods: {
    async getTeacherList(){
      const { data: res } = await this.$http.get("getTeacherList")
      console.log(res);
      this.teacherList = res;
    },
    async change(val) {
      const { data: res } = await this.$http.get("/getidByName?"+"val="+val);
      this.addForm.tid = res;
      console.log(this.addForm.tid);
      // this.addForm.tid = this.teacherList.a;
    },

    getUser () {
      this.user = JSON.parse(window.sessionStorage.getItem('user'));
      console.log(this.user.username);
    },
    async getWorkList() {
      // 调用get请求
      const { data: res } = await this.$http.get("getAllWorks", {
        params: this.workInfo
      });
      this.worklist = res.data; // 将返回数据赋值
      this.total = res.numbers; // 总个数
      this.loading = false;
    },
    stateFormat(row){
      // console.log("row="+row.isfinished);
        if (row.isfinished === 1) {
          return '已完成';
        }
        else if (row.isfinished === 0) {
          return '未完成';
        }
        else if (row.isfinished === 2) {
          return '未分配';
        }
    },
    async getCourseMap() {
      // 调用get请求
      const { data: res } = await this.$http.get("/getCourseMap");
      this.course = res;
      console.log(res);
    },

    async changeFenqiRate(val) {
      const { data: res } = await this.$http.get("/getCidByName?"+"val="+val);
      console.log(res);
      this.addForm.cid = res.cid;
      this.addForm.address = res.address;
      this.weeks = [];
      let a = res.start;
      let b = res.end;
      for (let i = a; i <= b; i++) {
        this.weeks.push(i);
      }
      console.log("周次"+ this.weeks);
      let zhou1 = res.time1;
      let zhou2 = res.time2;
      let zhou3 = res.time3;
      let zhou4 = res.time4;
      let zhou5 = res.time5;
      this.timeList = [];
      if (zhou1 !== null && zhou1 !== undefined &&  zhou1 !== '') {
        this.timeList.push("周一/"+ zhou1);
      }
      if (zhou2 !== null && zhou2 !== undefined &&  zhou2 !== '') {
        this.timeList.push("周二/"+ zhou2);
      }if (zhou3 !== null && zhou3 !== undefined &&  zhou3 !== '') {
        this.timeList.push("周三/"+ zhou3);
      }if (zhou4 !== null && zhou4 !== undefined &&  zhou4 !== '') {
        this.timeList.push("周四/"+ zhou4);
      }
      if (zhou5 !== null && zhou5 !== undefined &&  zhou5 !== '') {
        this.timeList.push("周五/"+ zhou5);
      }
      console.log("听课时间"+ this.timeList);
    },

    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.workInfo.pageSize = newSize;
      this.getWorkList(); // 数据发生改变重新申请数据
    },
    // 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      this.workInfo.pageNum = newPage;
      this.getWorkList(); // 数据发生改变重新申请数据
    },
    // 修改用户状态
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(
          `userState?id=${userinfo.id}&state=${userinfo.state}`
      );
      if (res !== "success") {
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
        const {data:res} = await this.$http.post("addWorks",this.addForm);
        if (res != "success") {
          this.addDialogVisible = false;
          return this.$message.error(res);
        }
        this.$message.success("操作成功！！！");
        //隐藏
        this.addDialogVisible = false;
        this.getWorkList();
        this.addForm.ownerName = '';
        this.$refs.addFormRef.resetFields();
      })
    },
    addQuxiao() {
      this.addDialogVisible = false;
      this.addForm.ownerName = '';
      this.$refs.addFormRef.resetFields();// 重置表单项
    },
    // 展示修改框
    async showEditDialog(id){

      const {data:res} = await this.$http.get("getWorkUpdate?id="+id);
      this.editForm = res;
      let val = res.cname;
      const { data: res1 } = await this.$http.get("/getCidByName?"+"val="+val);
      this.editWeeks = [];
      let a = res1.start;
      let b = res1.end;
      for (let i = a; i <= b; i++) {
        this.editWeeks.push(i);
      }
      console.log("周次"+ this.editWeeks);
      let zhou1 = res1.time1;
      let zhou2 = res1.time2;
      let zhou3 = res1.time3;
      let zhou4 = res1.time4;
      let zhou5 = res1.time5;
      this.editTimeList = [];
      if (zhou1 !== null && zhou1 !== undefined &&  zhou1 !== '') {
        this.editTimeList.push("周一/"+ zhou1);
      }
      if (zhou2 !== null && zhou2 !== undefined &&  zhou2 !== '') {
        this.editTimeList.push("周二/"+ zhou2);
      }if (zhou3 !== null && zhou3 !== undefined &&  zhou3 !== '') {
        this.editTimeList.push("周三/"+ zhou3);
      }if (zhou4 !== null && zhou4 !== undefined &&  zhou4 !== '') {
        this.editTimeList.push("周四/"+ zhou4);
      }
      if (zhou5 !== null && zhou5 !== undefined &&  zhou5 !== '') {
        this.editTimeList.push("周五/"+ zhou5);
      }
      this.editDialogVisible = true;
    },

    async showEditForm(id){
      console.log(id);
      if (id === 0) {
        return this.$message.error("该任务暂无反馈单！");
      }
      const {data:res} = await this.$http.get("getForm?id="+id);
      // if (res != "success") {
      // userinfo.state = !userinfo.state;
      // return this.$message.error("操作失败！！！");
      // }
      // this.$message.success("操作成功！！！");
      console.log(res);
      this.form = res;
      this.formVisible = true;
    },

    // 关闭窗口
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    // 确认修改
    async editUserInfo() {
        const {data: res} = await this.$http.put("editWork", this.editForm);
        console.log(res);
        if (res != "success") return this.$message.error("操作失败！！！");
        this.$message.success("操作成功！！！");
        //隐藏
        this.editDialogVisible = false;
        this.getWorkList();

    },
    fenWorkInfo() {
      this.$refs.fenForm.validate(async valid =>{
        console.log(valid);
        if( !valid ) return;
        // 发起请求
        const {data:res} = await this.$http.post("updateWorkTeacher",this.fenForm);
        console.log(res);
        if (res !=="success") return this.$message.error("操作失败！！！");
        this.$message.success("操作成功！！！");
        //隐藏
        this.fenDialogVisible = false;
        this.getWorkList();
      });
      this.$refs.fenForm.resetFields();

    },
    // 删除按钮
    async deleteWork(id){
      // 弹框
      const confirmResult = await this.$confirm('此操作将删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 成功删除为confirm 取消为 cancel
      if(confirmResult!='confirm'){
        return this.$message.info("已取消");
      }
      const {data:res} = await this.$http.delete("deleteWork?id="+id);
      if (res != "success") {
        return this.$message.error("操作失败！！！");
      }
      this.$message.success("操作成功！！！");
      this.getWorkList();
    },
    async  distribution(id) {
      const {data:res} = await this.$http.get("getWorkById?id="+id);
      this.fenDialogVisible = true;
      this.fenForm.cname = res.cname;
      this.fenForm.wname = res.wname;
      this.fenForm.id = res.id;
      console.log(res);
    },
    aaa(id) {
      this.$router.push({
        path: '/form',
        query: {
          formid: id
        }
      })
    },
    handleClick(tab) {
      console.log(tab.name);
      if (tab.name === 'first') {
        this.workInfo.isfinished = '';
        this.getWorkList();
      }else if (tab.name === 'second') {
        this.workInfo.isfinished = 1;
        this.getWorkList();

      }else if (tab.name === 'third') {
        this.workInfo.isfinished = 0;
        this.getWorkList();

      }
    },
  }
};
</script>
<style lang="less" scoped>
</style>
