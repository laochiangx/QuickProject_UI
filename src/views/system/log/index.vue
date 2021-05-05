<template>
  <el-card shadow="never">
    <div slot="header" ref="topHeader">
      <el-form :inline="true" :model="listQuery">
        <el-form-item label="日志标题:">
          <el-input
            style="width: 160px"
            v-model="listQuery.title"
            placeholder="日志标题"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search"
            >查询</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addEdit(null)">增加</el-button>
        </el-form-item> -->
      </el-form>
    </div>
    <div>
      <el-table
        ref="tableCot"
        v-loading="loading"
        element-loading-text="请稍后..."
        :data="logData"
        border
        style="width: 100%"
        :max-height="customTableHeight"
      >
        <el-table-column
          prop="id"
          label="日志编号"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="title"
          label="日志标题"
          min-width="120"
          show-overflow-tooltip
        />
      <el-table-column label="日志类型" prop="type" width="110px" align="center">
			  <template v-slot="scope">
			  <el-tag v-if="scope.row.type==='0'" type="success">登录日志</el-tag>
				<el-tag v-if="scope.row.type==='1'" type="success">用户日志</el-tag>
				<el-tag v-if="scope.row.type==='2'" type="success">菜单日志</el-tag>
			  </template>
		  </el-table-column>
        <!-- <el-table-column
          prop="type"
          label="日志类型"
          min-width="120"
          show-overflow-tooltip
        /> -->
        <el-table-column
          prop="ip"
          label="操作ip地址"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="addr"
          label="操作地址"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="requestUri"
          label="请求url"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="params"
          label="请求提交参数"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="time"
          label="请求时间"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="response"
          label="响应数据"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createBy"
          label="操作人"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column fixed="right" label="操作" width="130">
          <template slot-scope="scope">
            <el-tag
              style="cursor: pointer"
              size="mini"
              type="danger"
              @click="remove(scope.row)"
            >
              <i class="el-icon-delete" />删除
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
      <add-edit
        :dialog-visible="dialogVisible"
        :data="oneData"
        @close="closeDialog"
      />
    </div>
  </el-card>
</template>
<script>
import Pagination from "@/components/Pagination";
import systemLogApi from "@/api/system/log";

export default {
  name: "systemLog",
  components: { Pagination },
  data() {
    return {
      ztreeObj: null,
      setting: {
        check: {
          enable: true,
        },
        data: {
          simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pId",
            rootPId: 0,
          },
        },
      },
      loading: false,
      listQuery: {
        title: "",
        page: 1,
        pageSize: 10,
      },
      dialogVisible: false,
      total: 0,
      logData: [],
      oneData: {
        id: null,
        title: null,
        description: null,
        permission: [],
      },
      customTableHeight: 200,
    };
  },
  mounted() {
    this.getList();
    let that = this;
    window.onresize = () => {
      //37是box的header的padding，70=(60+10)是顶部的高度
      let tempHeaderHeight = this.$refs.topHeader.offsetHeight + 37 + 95;
      let tempHeight = document.body.clientHeight - (106 + tempHeaderHeight);
      if (tempHeight < 300) {
        tempHeight = 300;
      }
      that.customTableHeight = tempHeight;
    };
    setTimeout(function () {
      const resizeEvent = new Event("resize");
      window.dispatchEvent(resizeEvent);
    }, 100);
  },
  destroyed() {
    window.onresize = null;
  },
  methods: {
    search() {
      this.listQuery.page = 1;
      this.listQuery.pageSize = 10;
      this.getList();
    },
    getList() {
      this.loading = true;
      systemLogApi
        .list(this.listQuery)
        .then((res) => {
          this.logData = res.data || [];
          this.total = res.count || 0;
          this.loading = false;
        })
        .catch(() => (this.loading = false));
    },
    remove(row) {
      this.$confirm("此操作将永久删除日志, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        systemLogApi.remove(row.id).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getList();
        });
      });
    },
    closeDialog() {
      if (this.dialogVisible) {
        this.getList();
      }
      this.dialogVisible = false;
      this.oneData = {
        id: null,
        title: null,
        description: null,
        permission: [],
      };
    },
  },
};
</script>
