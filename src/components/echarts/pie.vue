<template>
  <div id="pie" style="width: 78%;height: 350px;"></div>
</template>
<script>
import echarts from 'echarts';
require('echarts/theme/macarons') // echarts theme

export default {
  name: 'pie',
  data() {
    return {
      charts: '',
      opinion:[1,2,3,4,5,6,7,8],
      opinionData:[]
    }
  },
  created() {
    this.getPieList();
  },
  methods: {
    async getPieList() {
      const {data: res} = await this.$http.get("getPie")
      console.log(res);
      this.opinionData = res;
      this.drawPie();
      // this.drawPie1();
    },
    drawPie() {
      console.log("1111" + this.opinionData);
      this.charts = echarts.init(document.getElementById('pie'))
      this.charts.setOption({
        title: {
          text: '学生评教统计饼图',
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
