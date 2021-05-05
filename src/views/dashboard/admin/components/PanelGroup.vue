<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="permission" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">系统名称</div>
          <div class="card-panel-text">{{sysName}}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="international" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">系统架构</div>
          <div class="card-panel-text">{{sysArch}}</div>
      </div>
        </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="icon" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">系统版本</div>
          <div class="card-panel-text">{{syversion}}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="list" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">可用处理器个数</div>
          <div class="card-panel-text">{{availableProcessors}}</div>
           </div>
        </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="richText" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">物理内存(G)</div>
          <div class="card-panel-text">{{totalPhysicalMemorySize}}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="search" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">系统CPU使用</div>
          <div class="card-panel-text">{{systemCpuLoad}}%</div>
      </div>
        </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="size" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">JVMCPU使用率</div>
          <div class="card-panel-text">{{processCpuLoad}}%</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="star" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">CPU平均负载</div>
          <div class="card-panel-text">{{systemLoadAverage}}%</div>
           </div>
        </div>
    </el-col>
  </el-row>

</template>

<script>
import CountTo from "vue-count-to";
import systemInfoApi from "@/api/system/systemInfo";
export default {
  components: {
    CountTo,
  },
  data() {
    return {
    
      data: [],
      datas: [],
      datass: [],
      sysName: "",
      sysName:"",
      sysArch:"",
      syversion:"",
      availableProcessors:"",
      totalPhysicalMemorySize:"",
      systemCpuLoad:"",
      processCpuLoad:"",
      systemLoadAverage:"",
      myChart: {},
        chart: null,
        nowDate:"2021/04/20 22:16",
        systemInfo:null
    }
  },
  mounted() {
    this.initChart();
  },

  methods: {
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    },
    initChart() {
      systemInfoApi
        .getOverView()
        .then((res) => {
          if (res.data) {
            console.log(res.data.systemInfo)
          this.sysName=res.data.systemInfo.name
          this.sysArch=res.data.systemInfo.arch
          this.syversion=res.data.systemInfo.version
          this.availableProcessors=res.data.systemInfo.availableProcessors
          this.totalPhysicalMemorySize=(res.data.systemInfo.totalPhysicalMemorySize/1024/1024/1024).toFixed(2).toString()
          this.systemCpuLoad=(res.data.systemInfo.systemCpuLoad*100).toFixed(2).toString()
          this.processCpuLoad=(res.data.systemInfo.processCpuLoad*100).toFixed(2).toString()
          this.systemLoadAverage=(res.data.systemInfo.systemLoadAverage).toFixed(2).toString()
          } else {
              this.sysName="win102"
          
          }
        })
        .catch();
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
