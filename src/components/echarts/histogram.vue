<template>
  <div id="histogram" style="width: 100%;height: 350px;"></div>
</template>
<script>
import echarts from 'echarts';
require('echarts/theme/macarons') // echarts theme

export default {
  data() {
    return {
      Data1:[],
      Data2:[],
      Data3:[],
      Data4:[],
      name:[],
      aa:[],
      user:{},
      title:'',
    }
  },
  created() {
    this.getUser();
    this.getPieList();
  },
  methods: {
    async getPieList() {
      if (this.user.role === '1') {
        const {data: res} = await this.$http.get("getHistogram")
        this.Data1 = res[0];
        this.Data2 = res[1];
        this.Data3 = res[2];
        this.Data4 = res[3];
        this.aa = ['优', '良', '中', '差'];
        this.title = '各学院听课情况统计';
        this.name = [ '计算机科学与工程学院', '经济管理学院', '电子信息工程学院', '理学院','材料科学与工程学院', '建筑工程学院','体育学院', '人文学院']
      }else if(this.user.role === '0' || this.user.role === '4') {
        const {data: res} = await this.$http.get("getHistogram1")
        const {data: res1} = await this.$http.get("getTeacherList")
        this.Data1 = res;
        this.name = res1;
        this.title = '本学院各老师听课任务个数';
        this.aa = ['任务数量'];
      }
      this.drawPie();
      // this.drawPie1();
    },
    async getUser() {
      this.user = JSON.parse(window.sessionStorage.getItem('user'));
    },

    drawPie() {
      // console.log("1111" + this.opinionData);
      this.charts = echarts.init(document.getElementById('histogram'))
      this.charts.setOption({
        title: {
          text: this.title,
          subtext: '',
          left: 'left'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // Use axis to trigger tooltip
            type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {
          data: this.aa
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: this.name,
        },
        series: [
          {
            name: '优',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.Data1
          },
          {
            name: '良',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.Data2
          },
          {
            name: '中',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.Data3
          },
          {
            name: '差',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.Data4
          },
        ]
      })
    }
  },
      //调用
  mounted() {
    this.$nextTick(function () {
      this.drawPie('main');
    })
  },
  updated() {
    debugger;
    this.$nextTick(function () {
      this.drawPie('main');
    })
  }

}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
