<template>
  <el-card shadow="never">
    <div>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%;"
        element-loading-text="请稍后..."
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="orgName" label="部门名称" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-if="scope.row.edit" v-model="scope.row.orgName" style="width: 50%" size="small" placeholder="部门名称">
              {{ scope.row.orgName }}
            </el-input>
            <span v-else>{{ scope.row.orgName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="地址" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-if="scope.row.edit" v-model="scope.row.address" size="small" placeholder="地址">
              {{ scope.row.address }}
            </el-input>
            <span v-else>{{ scope.row.address }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="sort" label="序号" min-width="60">
          <template slot-scope="scope">
            <el-input-number
              v-if="scope.row.edit"
              v-model="scope.row.sort"
              size="small"
              controls-position="right"
              placeholder="序号"
              :min="0"
              style="width: 90px"
            />
            <span v-else>{{ scope.row.sort }}</span>
          </template>
        </el-table-column>

        <el-table-column width="170" fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.edit"
              style="margin-right: 8px"
              type="text"
              size="mini"
              @click="cancel(scope.row)"
            >
              取消
            </el-button>
            <el-tag v-if="scope.row.edit" style="cursor:pointer;" size="mini" @click="save(scope.row)">
              <i class="el-icon-finished" />保存
            </el-tag>
            <el-tag v-else style="cursor:pointer;margin-right: 4px;" size="mini" @click="edit(scope.row)">
              <i class="el-icon-edit" />编辑
            </el-tag>
            <el-dropdown size="mini" @command="((type)=>handleCommand(type,scope.row))">
              <el-button size="mini" type="text">
                增加部门
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="1">同级部门</el-dropdown-item>
                <el-dropdown-item :command="2">子部门</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <icon :dialog-visible="iconVisible" :bind-data="tempBindData" @selected="saveIcon" @close="closeTempDialog" />
    </div>
  </el-card>
</template>
<script>
import icon from '@/views/system/org/icon'
import orgApi from '@/api/system/org'

export default {
  title: 'systemorg',
  components: { icon },
  data() {
    return {
      loading: false,
      iconVisible: false,
      tempBindData: null,
      tableData: [],
      listQuery: {
        mType: 1
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      orgApi.listTree(this.listQuery).then(res => {
        this.tableData = res.data || []
        this.loading = false
      }).catch(() => this.loading = false)
    },
    editIcon(row) {
      this.iconVisible = true
      this.tempBindData = row
    },
    saveIcon(data) {
      console.log(data)
      if (data.data.edit) {
        data.data.icon = data.value
      } else {
        orgApi.update({ id: data.data.id, orgName: data.data.orgName, icon: data.value }).then(res => {
          data.data.icon = data.value
        })
      }
    },
    edit(row) {
      row.edit = true
      console.log(row)
    },
    save(row) {
      const data = JSON.parse(JSON.stringify(row))
      if (row.newd && row.newd === 1) {
        data.id = null
        orgApi.save(data).then(res => {
          row.edit = false
          row.id = res.data.id
          row.newd = 2
        })
      } else {
        orgApi.update(data).then(res => {
          row.edit = false
        })
      }
    },
    cancel(row) {
      row.edit = false
    },
    handleCommand(type, row) {
      const tempData = {
        'id': new Date().getTime(),
        'orgPid': row.orgPid,
        'orgName': '部门名称',
        'address': '',
        'isLeaf': 0,
        'sort': 0,
        'type': 2,
        'permission': '',
        'level': 1,
        'edit': true,
        'children': [],
        'newd': 1
      }
      if (type === 1) {
        const parent = this.getNode(row.orgPid)
        tempData.orgPid = row.orgPid
        tempData.title = '同级部门'
        if (row.orgPid === 0) {
          parent.push(tempData)
        } else {
          parent.children.push(tempData)
        }
      } else {
        row.children = row.children || []
        tempData.orgPid = row.id
        tempData.title = '子同级'
        row.children.push(tempData)
      }
    },
    closeTempDialog() {
      this.iconVisible = false
      this.tempBindData = null
    },
    getNode(id) {
      if (id === 0) {
        return this.tableData
      } else {
        return this.getChild(this.tableData, id)
      }
    },
    getChild(child, id) {
      for (const i in child) {
        if (child[i].id === id) {
          return child[i]
        } else {
          const result = this.getChild(child[i].children || [], id)
          if (result) {
            return result
          }
        }
      }
    },
    saveToporg(data) {
      orgApi.update({ id: data.data.id, orgName: data.data.orgName, tId: data.value.id }).then(res => {
        this.$message.success('设置成功')
        data.data.tId = data.value.id
        data.data.tName = data.value.name
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .org-title {
    font-weight: bold;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
