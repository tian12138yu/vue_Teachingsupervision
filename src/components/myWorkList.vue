<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的任务</el-breadcrumb-item>
      <el-breadcrumb-item>任务列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部任务" name="first"  >全部任务</el-tab-pane>
        <el-tab-pane label="已完成" name="second" >已完成</el-tab-pane>
        <el-tab-pane label="未完成" name="third" >未完成</el-tab-pane>
      </el-tabs>
    </template>
    <el-card>
      <el-row :gutter="25">
        <el-col :span="10">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入搜索内容" v-model="workInfo.query" clearable @clear="getWorkList">
            <el-button slot="append" icon="el-icon-search" @click="getWorkList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="worklist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="任务号" prop="id"></el-table-column>
        <el-table-column label="任务简介" prop="wname"></el-table-column>
        <el-table-column label="创建时间" prop="creatime"></el-table-column>
        <el-table-column label="代课老师" prop="tname"></el-table-column>
        <el-table-column label="听课时间" prop="time"></el-table-column>
        <el-table-column label="是否完成" prop="isfinished">
          <template slot-scope="scope">
            {{ scope.row.isfinished === 1 ? "已完成" : "未完成" }}
          </template>
        </el-table-column>
        <el-table-column label="课程号" prop="cid"></el-table-column>
        <el-table-column label="课程名称" prop="cname">
        </el-table-column>
        <el-table-column label= "反馈表" prop="formid" >
          <template slot-scope="scope">
            <el-button type=" success" v-if="scope.row.isfinished === 0" :disabled="scope.row.formid === 0" size= mini  @click="showForm(scope.row.id,scope.row.cname,scope.row.formid)">编辑反馈表</el-button>
            <el-button type=" success" v-if="scope.row.isfinished !== 0" size= mini  @click="showEditForm(scope.row.formid)">查看反馈表</el-button>
          </template>
        </el-table-column>
        <el-table-column label= "历史评价" prop="" >
          <!--          <template slot-scope="scope">-->
          <el-popover
              placement="left"
              width="350"
              slot-scope="scope"
              trigger="click">
            <el-table :data="gridData" width="50%">
              <el-table-column  property="createtime" label="日期"></el-table-column>
              <el-table-column  property="evaluate" label="评价"></el-table-column>
            </el-table>
            <el-button slot="reference" type="success" size= mini @click="getHistory(scope.row.cname)">查看</el-button>
          </el-popover>
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

    <!--显示具体的反馈单-->
    <el-dialog title="反馈单（确认后将提交）" :visible.sync="formVisible" width="50%" @colse="editDialogClosed">
      <el-form :model="form"  :rules="editFormRules" ref="editFormRef" label-width="80px" label-position=top>
        <!-- 密码 -->
        <el-form-item label="任务ID" prop="wid">
          <el-input v-model="form.wid" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程名称" prop="cid">
          <el-input v-model="form.cid" disabled></el-input>
        </el-form-item>
        <el-form-item label="院系" prop="departmentname">
          <el-input v-model="form.departmentname" disabled></el-input>
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
        <el-form-item label= '总评' v-if="form.summary !== 0" prop="summary"  >

          <el-input v-model="form.summary"></el-input>
        </el-form-item>
        <el-form-item label= '备注' prop="remarks"  >

          <el-input v-model="form.remarks"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editClosed">取 消</el-button>
        <el-button type="primary" @click="editCommit()">确 定</el-button>
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
      button:false,
      worklist: [],// 用户列表

      total: 0, // 最大数据记录
      addDialogVisible: false ,// 对话框显示
      // 添加用户表单项
      activeName: 'first',
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
      form:{
        id:'',
        wid:'',
        situation:'',
        attendanceRate:'',
        teacherStatus:'',
        cid:'',
        departmentname:'',
        majorname: '',
        creatime: '',
        evaluate: '',
        remarks: '',
      },
      // 验证规则
      user:{

      },
      gridData: [],
      editFormRules:{
        situation:[
          { required: true, message: "请输入课堂情况", trigger: "blur" },
          { min: 1, max: 1, message: "(优，良，中，差)", trigger: "blur" }
        ],
        attendanceRate:[
          { required: true, message: "请输入学生到课情况", trigger: "blur" },
          { min: 1, max: 1, message: "(优，良，中，差)", trigger: "blur" }
        ],
        teacherStatus:[
          { required: true, message: "请输入老师状态", trigger: "blur" },
          { min: 1, max: 1, message: "(优，良，中，差)", trigger: "blur" }
        ],
        cid:[
          { required: true, message: "请输入课程号", trigger: "blur" },
          { min: 2, max: 8, message: "请输入正确课程号", trigger: "blur" }
        ],
        departmentname:[
          { required: true, message: "请输入院系名称", trigger: "blur" },
          { min: 2, max: 15, message: "请输入正确院系名称", trigger: "blur" }
        ],
        majorname:[
          { required: true, message: "请输入专业名称", trigger: "blur" },
          { min: 2, max: 15, message: "请输入正确专业名称", trigger: "blur" }
        ],
        evaluate:[
          { required: true, message: "请输入评价", trigger: "blur" },
          { min: 1, max: 1, message: "(优，良，中，差)", trigger: "blur" }
        ],
        remarks:[
          { required: true, message: "请输入总结", trigger: "blur" },
          { min: 15, max: 100, message: "总结字数15-100！", trigger: "blur" }
        ],

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
      this.workInfo.tid = this.user.id;
      const { data: res } = await this.$http.get("getMyWorks", {
        params: this.workInfo
      });
      this.worklist = res.data; // 将返回数据赋值
      this.total = res.numbers; // 总个数
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
    // 监听添加用户
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();// 重置表单项
    },
    // 展示修改框
    async showEditDialog(id){

      const {data:res} = await this.$http.get("getWorkUpdate?id="+id);
      // if (res != "success") {
      // userinfo.state = !userinfo.state;
      // return this.$message.error("操作失败！！！");
      // }
      // this.$message.success("操作成功！！！");

      this.editForm = res;
      this.editDialogVisible = true;
    },

    async showEditForm(id){
      console.log(id);
      const {data:res} = await this.$http.get("getForm?id="+id);
      console.log(res);
      this.form = res;
      this.formVisible = true;
    },
    async showForm(id,name,formId){
      const {data:res1} = await this.$http.get("getForm?id="+formId);
      // console.log(res1);
      this.form = res1;
      const { data: res } = await this.$http.get("/getCidByName?val="+name);
      this.form.wid = id;
      this.form.cid = name;
      this.form.departmentname = res.departmentname;
      this.formVisible = true;
    },

    async editCommit() {
      const {data:res} = await this.$http.post("editForm",this.form);
      if (res !== 'success') {
        return this.$message.error("失败！");
      }
      this.form = {};
      // this.$refs.editFormRef.resetFields();// 重置表单项
      this.formVisible = false;
      this.getWorkList();
    },

    editClosed(){
      this.form = {};
      // this.$refs.editFormRef.resetFields();// 重置表单项
      this.formVisible = false;

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
        const {data:res} = await this.$http.put("editWork",this.editForm);
        console.log(res);
        if (res != "success") return this.$message.error("操作失败！！！");
        this.$message.success("操作成功！！！");
        //隐藏
        this.editDialogVisible = false;
        this.getWorkList();
      });
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
    aaa(id) {
      this.$router.push({
        path: '/form',
        query: {
          formid: id
        }
      })
    },
    async getHistory(cname) {
      debugger;
      const { data: res } = await this.$http.get("getHistory?cname="+cname)
      this.gridData = res;
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
