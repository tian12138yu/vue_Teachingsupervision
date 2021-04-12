<template>
  <div>
    <div>
      <span>1.从老师本次的讲课情况来看，我感受他(她):</span>
      <br/>
      <el-radio v-model="form.radio" label="1">A:备课充分，教学目标明确</el-radio> <br/>
      <el-radio v-model="form.radio" label="2">B:备课一般，教学目标较模糊</el-radio> <br/>
      <el-radio v-model="form.radio" label="3">C:没有备课，讲课很随意</el-radio> <br/>
    </div>
    <el-divider></el-divider>
    <div>
      <span>2.我感觉老师在讲课的内容安排上:</span>
      <br/>
      <el-radio v-model="form.state" label="1">A:重点突出，详略得当，难度适宜</el-radio> <br/>
      <el-radio v-model="form.state" label="2">B:有重点难点但不突出，平铺直叙</el-radio> <br/>
      <el-radio v-model="form.state" label="3">C:无重点难点，缺乏条理</el-radio> <br/>
    </div>
    <el-divider></el-divider>
    <div>

      <span>3.我感觉在本次上课过程中，老师的态度是：</span>
      <br/>
      <el-radio v-model="form.x" label="1">A:认真负责</el-radio> <br/>
      <el-radio v-model="form.x" label="2">B:还行吧！</el-radio> <br/>
      <el-radio v-model="form.x" label="3">C:不太认真，有些敷衍</el-radio> <br/>
    </div>
    <el-divider></el-divider>
    <div>

      <span>4.我感觉课堂上的气氛如何？</span>
      <br/>
      <el-radio v-model="form.x" label="1">A:严格、有序、充满活力</el-radio> <br/>
      <el-radio v-model="form.x" label="2">B:一般</el-radio> <br/>
      <el-radio v-model="form.x" label="3">C:嘈杂、纪律较差</el-radio> <br/>
    </div>
    <el-divider></el-divider>
    <div>
      <span>5.这节课，老师给我的感觉是</span>
      <br/>
      <el-radio v-model="form.x" label="1">A:衣着整洁得体，举止大方文明，普通话标准，语言规范，声音清晰亲切</el-radio> <br/>
      <el-radio v-model="form.x" label="2">B:衣着得体，举止文明，普通话不太标准，声音偏小或语速较快</el-radio> <br/>
      <el-radio v-model="form.x" label="3">C:不太注意衣着，有不文明举止，讲课方言较多，听课很费力</el-radio> <br/>
    </div>
    <el-divider></el-divider>
    <div>
      <span>*6.在这节课上，老师在帮助我理解课程内容方面是如何做的？</span>
      <br/>
      <el-radio v-model="form.x" label="1">A:课程内容显示直观，课件与板书结合不错，我容易理解课程内容。</el-radio> <br/>
      <el-radio v-model="form.x" label="2">B:主要是课件或板书，符合课程内容需求，我能理解课程内容。</el-radio> <br/>
      <el-radio v-model="form.x" label="3">C:无课件也无板书，以讲授为主，方法单一，有些课程内容我不太理解。</el-radio> <br/>
    </div>
    <el-divider></el-divider>
    <div>
      <span>*7.对于老师授课时启发学生思考和调动学习兴趣等方面，我的感觉是</span>
      <br/>
      <el-radio v-model="form.x" label="1">A:互动很多</el-radio> <br/>
      <el-radio v-model="form.x" label="2">B:有互动，但是不起兴趣</el-radio> <br/>
      <el-radio v-model="form.x" label="3">C:没有互动</el-radio> <br/>
    </div>
    <el-divider></el-divider>
    <div>
      <span>*8.总体上，我对本次课：</span>
      <br/>
      <el-radio v-model="form.x" label="1">A:非常满意，很有收获</el-radio> <br/>
      <el-radio v-model="form.x" label="2">B:基本满意，有收获</el-radio> <br/>
      <el-radio v-model="form.x" label="3">C:不满意，没有收获</el-radio> <br/>
    </div>
    <el-row :gutter="25">
      <el-col :span="2">
        <el-button type="primary" @click="commit">提交</el-button>
      </el-col>
    </el-row>
  </div>

</template>

<script>
export default {
  data () {
    return {
      form: {
        radio: '',
        state:'',
        x:''
      }

    };
  },
  methods: {
    async commit() {
      const {data:res} = await this.$http.post("addStudentForm",this.form);
      console.log(res);
    }
  }
}
</script>

<style scoped>

</style>
