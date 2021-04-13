<template>
  <div class="transfer-footer" >
    <el-header>
      <h1>设计反馈单</h1>
    </el-header>
    <el-form :model="dynamicValidateForm"
             ref="dynamicValidateForm"
             label-width="auto"
             label-position="right"
             class="transfer-footer"
             :inline="true"
    >
      <el-row>
        <el-form-item
            prop="wid"
            label="任务号"
            :rules="[
      // { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    ]"
        >
          <el-input v-model="dynamicValidateForm.wid" disabled></el-input>
        </el-form-item>

      </el-row>

      <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :label="'评价' + index"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
          :rules="{
      required: true, message: '评价不能为空', trigger: 'blur'
    }"
      >
        <el-select v-model="domain.value"  placeholder="请选择" style="width: 100%">
          <el-option
              v-for="(item) in formText"
              :key="item.index"
              :label="item"
              :value="item">
          </el-option>
        </el-select>
        <el-button @click.prevent="removeDomain(domain)">删除</el-button>
      </el-form-item>
      </br>
      <el-form-item>
        <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
        <el-button @click="addDomain">新增评价列</el-button>
        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
        <el-button @click="resetForm('dynamicValidateForm')">新增评价</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
export default {
  data() {
    return {
      dynamicValidateForm: {
        domains: [{
          value: ''
        }],
        wid: ''
      },
      formText:[],
    };
  },
  created() {
    this.getUrl();
    this.getFormText();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid  => {
        if (valid) {
          // alert('submit!');
          const {data :res} = await this.$http.post("/newForm", this.dynamicValidateForm);
          this.$message.info(res);
          console.log(this.dynamicValidateForm);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      if (this.dynamicValidateForm.domains.length === 1) {
        this.$message.error('评价最少为1条！');
        return;
      }

      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      if (this.dynamicValidateForm.domains.length <= 9) {
        this.dynamicValidateForm.domains.push({
          value: '',
          key: Date.now()
        });
      }else {
        this.$message.error('最大值添加数为9！');
      }
    },
    getUrl () {
      const url = document.URL; //获取当前页面的url
      const urlA = url.split('?');//以url中的问号进行分割;
      const id = urlA[1].split('=');
      debugger;
      this.dynamicValidateForm.wid = id[1]; //
      // return this.$message.info(this.$data.formId);
    },
    async getFormText() {
      const {data: res} = await this.$http.get("/getFormText");
      this.formText = res;
    },
  }
}
</script>
<style>
.transfer-footer {
  position: center;
  margin-left: 20px;
  padding: 6px 5px;
}
</style>
