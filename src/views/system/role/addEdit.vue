<template>
  <el-dialog title="角色信息" :visible.sync="tempDialogVisible" width="550px" :close-on-click-modal="false"
             @close="close">
    <el-form status-icon :model="tempData" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="角色名称：" prop="roleName">
        <el-input size="medium" v-model="tempData.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input size="medium" type="textarea" v-model="tempData.description"></el-input>
      </el-form-item>
      <el-form-item label="角色权限：">
        <tree :setting="setting" :nodes="treePermission"
              @onCreated="handleCreated"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import tree from 'vue-giant-tree'
  import roleApi from '@/api/system/role'
  import menuApi from '@/api/system/menu'

  export default {
    name: 'RoleAddEdit',
    components: { tree },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      data: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        tempDialogVisible: false,
        tempData: {
          id: null,
          roleName: null,
          description: null,
          permission: []
        },
        ztreeObj: null,
        setting: {
          check: {
            enable: true
          },
          data: {
            key: {
              name: 'title'
            },
            simpleData: {
              enable: true,
              idKey: 'id',
              pIdKey: 'pId',
              rootPId: 0
            }
          }
        },
        treePermission: [],
        rules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      dialogVisible: function(val) {
        if (val) {
          this.initRole()
        }
        this.tempDialogVisible = val
      },
      data: function(val) {
        this.tempData = val
      }
    },
    mounted() {

    },
    methods: {
      initRole() {
        menuApi.list({}).then(res => {
          this.treePermission = res.data || []
          this.selectDefault()
        })
      },
      selectDefault() {
        if (this.tempData.id) {
          roleApi.getOne(this.tempData.id).then(res => {
            let tag = true
            while (tag) {
              if (null != this.ztreeObj) {
                res.data.menu.forEach(item => {
                  let node = this.ztreeObj.getNodeByParam('id', item)
                  this.ztreeObj.checkNode(node)
                })
                tag = false
              }
            }
          })
        }
      },
      handleCreated: function(ztreeObj) {
        this.ztreeObj = ztreeObj
        this.ztreeObj.expandAll(true)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let checked = this.ztreeObj.getCheckedNodes(true)
            let subData = {
              roleName: this.tempData.roleName,
              description: this.tempData.description,
              menu: []
            }
            if (checked && checked.length > 0) {
              checked.forEach(item => {
                subData.menu.push(item.id)
              })
            }
            if (this.tempData.id) {
              subData.id = this.tempData.id
              roleApi.update(subData).then(res => {
                this.$message.success('更新成功')
                this.close()
              })
            } else {
              roleApi.save(subData).then(res => {
                this.$message.success('添加成功')
                this.close()
              })
            }
            console.log(checked)
          } else {
            return false
          }
        })
      },
      close() {
        this.ztreeObj.checkAllNodes(false)
        this.$refs['ruleForm'].clearValidate()
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>

</style>
