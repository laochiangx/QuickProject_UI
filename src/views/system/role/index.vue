<template>
  <el-card shadow="never">
    <div slot="header" ref="topHeader">
      <el-form :inline="true" :model="listQuery">
        <el-form-item label="角色名:">
          <el-input style="width: 160px" v-model="listQuery.name" placeholder="角色名" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addEdit(null)">增加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table ref="tableCot" v-loading="loading" element-loading-text="请稍后..." :data="roleData" border
                style="width: 100%" :max-height="customTableHeight">
        <el-table-column type="index" width="40"/>
        <el-table-column prop="roleName" label="角色名" min-width="120" show-overflow-tooltip/>
        <el-table-column prop="description" label="角色描述" min-width="120" show-overflow-tooltip/>
        <el-table-column prop="updateUserName" label="创建人" min-width="120" show-overflow-tooltip/>
        <el-table-column prop="updateTime" label="最近更新时间" min-width="120" show-overflow-tooltip/>
        <el-table-column label="状态" min-width="100">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.status==1?'已启用':'已禁用'" placement="top">
              <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="switchChange(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="130">
          <template slot-scope="scope">
            <el-tag style="cursor:pointer;margin-right: 4px;" size="mini" @click="addEdit(scope.row)">
              <i class="el-icon-edit"/>编辑
            </el-tag>
            <el-tag v-if="!scope.row.isSystem" style="cursor:pointer;" size="mini" type="danger"
                    @click="remove(scope.row)">
              <i class="el-icon-delete"/>删除
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList"/>
      <add-edit :dialog-visible="dialogVisible" :data="oneData" @close="closeDialog"/>
    </div>
  </el-card>
</template>
<script>
import Pagination from '@/components/Pagination'
import addEdit from '@/views/system/role/addEdit'
import roleApi from '@/api/system/role'

export default {
  name: 'systemRole',
  components: {Pagination, addEdit},
  data() {
    return {
      ztreeObj: null,
      setting: {
        check: {
          enable: true
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pId',
            rootPId: 0
          }
        }
      },
      loading: false,
      listQuery: {
        name: '',
        page: 1,
        pageSize: 10
      },
      dialogVisible: false,
      total: 0,
      roleData: [],
      oneData: {
        id: null,
        name: null,
        description: null,
        permission: []
      },
      customTableHeight: 200
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
    switchChange(row) {
      const enable = row.isEnable
      let text = '是否禁用角色？'
      let btnstatus=0
      if (enable) {
        text = '确认启用该角色？'
        btnstatus=1
      }
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnPressEscape: false,
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        roleApi.status(row.id, btnstatus).then(res => {

        }).catch(() => {
          row.isEnable = !enable
        })
      }).catch(() => {
        row.isEnable = !enable
      })
    },
    search() {
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.getList()
    },
    getList() {
      this.loading = true
      roleApi.list(this.listQuery).then(res => {
        this.roleData = res.data || []
        this.total = res.count || 0
        this.loading = false
      }).catch(() => this.loading = false)
    },
    addEdit(row) {
      if (row) {
        this.dialogVisible = true
        this.oneData = JSON.parse(JSON.stringify(row))
      } else {
        this.dialogVisible = true
      }
    },
    remove(row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roleApi.remove(row.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getList()
        })
      })
    },
    closeDialog() {
      if (this.dialogVisible) {
        this.getList()
      }
      this.dialogVisible = false
      this.oneData = {
        id: null,
        name: null,
        description: null,
        permission: []
      }
    }
  }
}
</script>
