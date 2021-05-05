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
        <el-table-column prop="title" label="标题" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-if="scope.row.edit" v-model="scope.row.title" style="width: 50%" size="small" placeholder="标题">
              {{ scope.row.title }}
            </el-input>
            <span v-else>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="name" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-if="scope.row.edit" v-model="scope.row.name" size="small" placeholder="name">
              {{ scope.row.name }}
            </el-input>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由地址" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-if="scope.row.edit" v-model="scope.row.path" size="small" placeholder="路由地址">
              {{ scope.row.path }}
            </el-input>
            <span v-else>{{ scope.row.path }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" min-width="60" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.icon" style="cursor:pointer;" @click="editIcon(scope.row)">
              <i v-if="scope.row.icon.indexOf('el-icon')!==-1" :class="scope.row.icon" />
              <svg-icon v-else :icon-class="scope.row.icon" />
            </span>
            <span v-else style="cursor:pointer;" @click="editIcon(scope.row)">
              无
            </span>
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
        <el-table-column prop="permission" label="权限标识" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-if="scope.row.edit" v-model="scope.row.permission" size="small" placeholder="权限标识">
              {{ scope.row.permission }}
            </el-input>
            <span v-else>{{ scope.row.permission }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-select v-if="scope.row.edit" v-model="scope.row.type" size="small" placeholder="请选择">
              <el-option label="菜单" :value="1" />
              <el-option label="按钮" :value="2" />
            </el-select>
            <span v-else>
              <el-tag v-if="scope.row.type===1" size="mini" type="success">菜单</el-tag>
              <el-tag v-else-if="scope.row.type===2" size="mini" type="warning">按钮</el-tag>
            </span>
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
                增加菜单
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="1">同级菜单</el-dropdown-item>
                <el-dropdown-item :command="2">子菜单</el-dropdown-item>
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
import icon from '@/views/system/menu/icon'
import menuApi from '@/api/system/menu'

export default {
  title: 'systemMenu',
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
      menuApi.listTree(this.listQuery).then(res => {
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
        menuApi.update({ id: data.data.id, title: data.data.title, icon: data.value }).then(res => {
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
        data.mType = this.listQuery.mType
        menuApi.save(data).then(res => {
          row.edit = false
          row.id = res.data.id
          row.newd = 2
        })
      } else {
        menuApi.update(data).then(res => {
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
        'pId': row.pId,
        'title': '菜单名称',
        'path': '',
        'icon': '',
        'sort': 0,
        'type': 2,
        'permission': '',
        'level': 1,
        'edit': true,
        'children': [],
        'newd': 1
      }
      if (type === 1) {
        const parent = this.getNode(row.pId)
        tempData.pId = row.pId
        tempData.title = '同级菜单'
        if (row.pId === 0) {
          parent.push(tempData)
        } else {
          parent.children.push(tempData)
        }
      } else {
        row.children = row.children || []
        tempData.pId = row.id
        tempData.title = '子菜单'
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
    saveTopMenu(data) {
      menuApi.update({ id: data.data.id, title: data.data.title, tId: data.value.id }).then(res => {
        this.$message.success('设置成功')
        data.data.tId = data.value.id
        data.data.tName = data.value.name
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .menu-title {
    font-weight: bold;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
