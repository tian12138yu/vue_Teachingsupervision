<template>
    <div class="main_welcome">
<!--        <h3>欢迎使用教学督导管理平台</h3>-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover" class="mgb20" style="height:252px;">
            <div class="user-info">
              <img
                  src="../assets/img.jpg"
                  class="user-avator"
                  alt
              />
              <div class="user-info-cont">
                <div class="user-info-name"> {{ this.user.name }} </div>
                <div v-if="this.user.role === '1' "> 管理员 </div>
                <div v-if="this.user.role === '0' "> 督导老师 </div>
                <div v-if="this.user.role === '2' "> 老师 </div>
                <div v-if="this.user.role === '3' "> 学生 </div>
              </div>
            </div>
            <div class="user-info-list">
              上次登录时间：
              <span>{{ this.user.lastTime }}</span>
            </div>
            <div class="user-info-list">
              上次登录地点：
              <span>北京</span>
            </div>
          </el-card>
          <el-card shadow="hover" style="height:252px;">
<!--            <div id="time" style="width: 100%;height: 350px;"></div>-->
            <Time style="width: 100%;height: 245px;top: 1%"></Time>

          </el-card>

<!--          <el-card shadow="hover" style="height:252px;">-->
<!--            <template #header>-->
<!--              <div class="clearfix">-->
<!--                <span>语言详情</span>-->
<!--              </div>-->
<!--            </template>-->
<!--            Vue-->
<!--            <el-progress-->
<!--                :percentage="71.3"-->
<!--                color="#42b983"-->
<!--            ></el-progress-->
<!--            >JavaScript-->
<!--            <el-progress-->
<!--                :percentage="24.1"-->
<!--                color="#f1e05a"-->
<!--            ></el-progress-->
<!--            >CSS <el-progress :percentage="13.7"></el-progress>HTML-->
<!--            <el-progress-->
<!--                :percentage="5.9"-->
<!--                color="#f56c6c"-->
<!--            ></el-progress>-->
<!--          </el-card>-->
        </el-col>
        <el-col :span="16">
          <el-row :gutter="20" class="mgb20">
            <el-col :span="8">
              <el-card
                  shadow="hover"
                  :body-style="{ padding: '0px' }"
              >
                <div class="grid-content grid-con-1">
                  <i class="el-icon-user-solid grid-con-icon"></i>
                  <div class="grid-cont-right">
                    <div class="grid-num">{{ param.countLoginTimes }}</div>
                    <div>用户访问量</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card
                  shadow="hover"
                  :body-style="{ padding: '0px' }"
              >
                <div class="grid-content grid-con-2">
                  <i
                      class="el-icon-data-board grid-con-icon"
                  ></i>
                  <div class="grid-cont-right">
                    <div class="grid-num">{{ param.countEvaluate }}</div>
                    <div>评价次数</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card
                  shadow="hover"
                  :body-style="{ padding: '0px' }"
              >
                <div class="grid-content grid-con-3">
                  <i class="el-icon-document grid-con-icon"></i>
                  <div class="grid-cont-right">
                    <div class="grid-num">{{ param.countWork }}</div>
                    <div>任务数量</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
<!--          <el-card shadow="hover" style="height:403px;">-->
<!--            <template #header>-->
<!--              <div class="clearfix">-->
<!--                <span>待办事项</span>-->
<!--                <el-button-->
<!--                    style="float: right; padding: 3px 0"-->
<!--                    type="text"-->
<!--                >添加</el-button-->
<!--                >-->
<!--              </div>-->
<!--            </template>-->

<!--            <el-table-->
<!--                :show-header="false"-->
<!--                :data="todoList"-->
<!--                style="width:100%;"-->
<!--            >-->
<!--              <el-table-column width="40">-->
<!--                <template #default="scope">-->
<!--                  <el-checkbox-->
<!--                      v-model="scope.row.status"-->
<!--                  ></el-checkbox>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column>-->
<!--                <template #default="scope">-->
<!--                  <div-->
<!--                      class="todo-item"-->
<!--                      :class="{-->
<!--                                        'todo-item-del': scope.row.status,-->
<!--                                    }"-->
<!--                  >-->
<!--                    {{ scope.row.title }}-->
<!--                  </div>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column width="60">-->
<!--                <template>-->
<!--                  <i class="el-icon-edit"></i>-->
<!--                  <i class="el-icon-delete"></i>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--            </el-table>-->
<!--          </el-card>-->
          <el-col :span="24">
            <el-card shadow="hover">
<!--              <line1></line1>-->
              <Histogram></Histogram>
            </el-card>
          </el-col>
        </el-col>
      </el-row>



      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <pie v-if="user.role !== '3' && user.role !== '2'" style="width: 78%;height: 350px;"></pie>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <div id="pie1" v-if="user.role !== '3' && user.role !== '2'" style="width: 78%;height: 350px;"></div>
          </el-card>
        </el-col>
      </el-row>


    </div>

</template>
<style lang="less" scoped>
.outside{
  positoion:relative;
}
</style>
<script>
import pie from "@/components/echarts/pie";
import line1 from "@/components/echarts/line";
import Time from "@/components/echarts/time";
import echarts from 'echarts';
import Histogram from "@/components/echarts/histogram";
require('echarts/theme/macarons')
export default {
  components: {line1, pie,Time,Histogram},
  data() {
    return {
      charts: '',
      formId: '0',
      opinion: [],
      opinionData: [],
      title: '教学质量统计饼图(总评优秀)',
      title1: '折线图',
      user:{},
      param:{},
  }

  },
  created() {
  },
  mounted(){
    this.getUser();
    this.getPieList();
    this.getParam();
  },
  methods: {
    async getUser() {
      this.user = JSON.parse(window.sessionStorage.getItem('user'));
    },
    async getPieList() {
      const {data: res} = await this.$http.get("getPie")
      console.log(res);
      this.opinionData = res;
      this.drawPie();
    },
    drawPie() {
      debugger;
      console.log('pie1'+this.opinionData);
      this.charts = echarts.init(document.getElementById('pie1'))
      this.charts.setOption({
        title: {
          text: this.title,
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          top: 'bottom',
          data: this.opinion
        },
        toolbox: {
          show: true,
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        series: [
          {
            name: '总计',
            type: 'pie',
            radius: [30, 100],
            center: ['60%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            data: this.opinionData
          },
        ]
      })
    },
    async getParam() {
      const {data: res} = await this.$http.get("getParam")
      this.param = res;
    }

  },



}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
