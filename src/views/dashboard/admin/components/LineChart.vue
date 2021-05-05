<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import systemInfoApi from "@/api/system/systemInfo";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    }
  },
  data() {
    return {
    
      data: [],
      datas: [],
      datass: [],
      myChart: {},
        chart: null,
        nowDate:"2021/04/20 22:16",
        systemInfo:null
    }
  },
  mounted() {


 this.$nextTick(() => {
      this.initChart();


      this.timer = setInterval(() => {

        let date = new Date();
      let year = date.getFullYear(); // 年
      let month = date.getMonth() + 1; // 月
      let day = date.getDate(); // 日
      let week = date.getDay(); // 星期
      let weekArr = [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ];
      let hour = date.getHours(); // 时
      hour = hour < 10 ? "0" + hour : hour; // 如果只有一位，则前面补零
      let minute = date.getMinutes(); // 分
      minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
      let second = date.getSeconds(); // 秒
      second = second < 10 ? "0" + second : second; // 如果只有一位，则前面补零
      this.nowDate = `${month}-${day} ${hour}:${minute}:${second}`;


        this.data.push(this.nowDate);
        systemInfoApi.getOverView().then(res => {
          if(res.data)
          {
              this.datas.push(parseFloat(res.data.systemInfo.systemCpuLoad*100).toFixed(2)) ;
              this.datass.push(parseFloat(res.data.systemInfo.processCpuLoad*100).toFixed(2));
          }else
          {

            this.datas.push(0) ;
            this.datass.push(0);
          }
          
        }).catch()
        if (this.data.length > 12) {
          this.data.splice(0, 1);
          this.datas.splice(0, 1);
          this.datass.splice(0, 1);
        }
        var option = this.chart.getOption();
        option.xAxis[0].data = this.data;
        option.series[0].data = this.datas;
        option.series[1].data = this.datass;
        this.chart.setOption(option);
        this.$forceUpdate();
      }, 3000);
    });
    
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        backgroundColor: '#fff',
        title: {
          top: 20,
          text: '实时系统、JVM CPU使用率（%）',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 12,
            color: '#000000'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['系统CPU使用率（%）', 'JVM CPU使用率（%）'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#000000'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true,
            x:25,
                  y:50,
                  x2:50,
                  y2:60,
                  borderWidth:10
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#0087ED'
            }
          },
            axisLabel: {
                interval:0,//代表显示所有x轴标签显示
            },
          data: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55']
        }],
        yAxis: [{
          type: 'value',
          name: '(%)',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#0087ED'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          
          splitLine: {
            show:false,
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: '系统CPU使用率（%）',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 2
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#fff'
              }, {
                offset: 0.8,
                color: '#fff'
              }], false),
              shadowColor: '#fff',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: '#da1f18',
              borderColor: 'rgba(219,50,51,0.2)',
              borderWidth: 12
            }
          },
          data: null
        }, {
          name: 'JVM CPU使用率（%）',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 2
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#fff'
              }, {
                offset: 0.8,
                color: '#fff'
              }], false),
              shadowColor: '#fff',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: '#00a8e1',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12

            }
          },
          data: null
        }]
      })
    }
  }
}
</script>
