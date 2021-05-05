<template>
  <el-card shadow="never">
    <div slot="header" ref="topHeader" class="sysUserSearchHeader">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="app_id:">
          <el-input style="width: 160px" v-model="listQuery.namePhone" placeholder="app_id" clearable/>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="listQuery.isEnable" style="width: 120px" placeholder="用户状态" clearable>
            <el-option label="启用" :value="true"/>
            <el-option label="已禁用" :value="false"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-circle-plus" @click="addEdit(null)">增加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <!--table data-->
      <el-table ref="tableCot" v-loading="loading" element-loading-text="请稍后..." :data="tableData" border
                style="width: 100%" :max-height="customTableHeight">
        <el-table-column type="index" width="40"/>
        <el-table-column prop="name" label="租户" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
            <i v-clipboard:copy='getCopyData(scope.row)' v-clipboard:success='clipboardSuccess'
               style="cursor: pointer;margin-left: 2px;position: absolute;right: 5px;top: 15px"
               title="复制app_id和app_secret" class="el-icon-copy-document"/>
          </template>
        </el-table-column>
        <el-table-column prop="appId" label="app_id" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.appId }}</span>
            <i v-clipboard:copy='scope.row.appId' v-clipboard:success='clipboardSuccess'
               style="cursor: pointer;margin-left: 2px;position: absolute;right: 5px;top: 15px"
               title="复制app_id" class="el-icon-copy-document"/>
          </template>
        </el-table-column>
        <el-table-column prop="appSecret" label="app_secret" min-width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.appSecret }}</span>
            <i v-clipboard:copy='scope.row.appSecret' v-clipboard:success='clipboardSuccess'
               style="cursor: pointer;margin-left: 2px;position: absolute;right: 5px;top: 15px"
               title="复制app_secret" class="el-icon-copy-document"/>
          </template>
        </el-table-column>
        <el-table-column prop="qps" label="QPS" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="0!==scope.row.qps">{{ scope.row.qps }}/s</span>
            <span v-else>无限制</span>
          </template>
        </el-table-column>
        <el-table-column prop="dayLimit" label="日请求限制" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.requested }}/</span>
            <span v-if="0!==scope.row.dayLimit">{{ scope.row.dayLimit }}</span>
            <span v-else>无限制</span>
          </template>
        </el-table-column>
        <el-table-column prop="dayLimit" label="累计请求限制" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.totalRequested }}/</span>
            <span v-if="0!==scope.row.totalLimit">{{ scope.row.totalLimit }}</span>
            <span v-else>无限制</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.isEnable?'已启用':'已禁用'" placement="top">
              <el-switch
                  v-model="scope.row.isEnable"
                  :active-value="true"
                  :inactive-value="false"
                  @change="switchChange(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="125">
          <template slot-scope="scope">
            <el-tag style="cursor:pointer;margin-right: 4px;" size="mini" @click="addEdit(scope.row)">
              <i class="el-icon-edit"/>编辑
            </el-tag>
            <el-tag style="cursor:pointer;" size="mini" type="danger" @click="remove(scope.row)">
              <i lass="el-icon-delete"/>删除
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!--分頁-->
      <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList"/>
      <!--添加/编辑-->
      <add-edit
          :dialog-visible="addEditVisible"
          :operation-type="operationType"
          :data="addEditData"
          @close="closeDialog"
      />
    </div>
  </el-card>
</template>
<script>
import Pagination from '@/components/Pagination'
import addEdit from '@/views/tenant/addEdit'
import tenantUserApi from '@/api/tenant/user'
import permission from '@/directive/permission/index.js'
import clipboard from '@/directive/clipboard/index.js'

export default {
  name: 'tenant',
  components: {Pagination, addEdit},
  directives: {permission, clipboard},
  data() {
    return {
      loading: false,
      addEditVisible: false,
      operationType: 1,
      customTableHeight: 200,
      formInline: {
        user: '',
        region: ''
      },
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10,
        namePhone: null,
        isEnable: null
      },
      tableData: [],
      addEditData: {}
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    }
  },
  mounted() {
    this.getList()
    let that = this
    window.onresize = () => {
      //37是box的header的padding，70=(60+10)是顶部的高度
      let tempHeaderHeight = this.$refs.topHeader.offsetHeight + 37 + 95
      let tempHeight = document.body.clientHeight - (106 + tempHeaderHeight)
      if (tempHeight < 300) {
        tempHeight = 300
      }
      that.customTableHeight = tempHeight
    }
    setTimeout(function () {
      const resizeEvent = new Event('resize')
      window.dispatchEvent(resizeEvent)
    }, 100)
  },
  destroyed() {
    window.onresize = null
  },
  methods: {
    search() {
      this.getList()
    },
    getList() {
      this.loading = true
      tenantUserApi.list(this.listQuery).then(res => {
        this.tableData = res.data || []
        this.total = res.count || 0
        this.loading = false
      }).catch(() => this.loading = false)
    },
    switchChange(row) {
      const enable = row.isEnable
      let text = '禁用后此租户将无法请求，是否继续？'
      if (enable) {
        text = '确认启用该租户？'
      }
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnPressEscape: false,
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        tenantUserApi.status(enable).then(res => {

        }).catch(() => {
          row.isEnable = !enable
        })
      }).catch(() => {
        row.isEnable = !enable
      })
    },
    addEdit(row) {
      this.operationType = row ? 2 : 1
      if (row) {
        row.role = []
        if (row.roles) {
          row.roles.forEach(item => {
            row.role.push(item.id)
          })
        }
        this.addEditData = JSON.parse(JSON.stringify(row))
      }
      this.addEditVisible = true
    },
    remove(row) {
      this.$confirm('删除后将无法恢复，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnPressEscape: false,
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        tenantUserApi.remove(row.id).then(res => {

        })
      })
    },
    closeDialog() {
      this.addEditVisible = false
      this.operationType = 1
      this.addEditData = {
        id: null,
        userName: '',
        nickName: '',
        phone: '',
        role: [],
        isEnable: true
      }
    },
    getCopyData(row) {
      return `app_id：${row.appId}，app_secret：${row.appSecret}`
    },
    clipboardSuccess() {
      this.$message.success('复制成功')
    }
  }
}
</script>
<style scoped lang="scss">

</style>
