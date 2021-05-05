<template>
  <el-dialog title="租户信息" :visible.sync="tempDialogVisible" width="550px" :close-on-click-modal="false"
             @close="close">
    <el-form status-icon :model="tempData" :rules="rules" ref="ruleForm" label-width="100px">

      <el-form-item label="租户名称：" prop="tenantName">
        <el-input size="medium" v-model="tempData.tenantName"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input size="medium" type="textarea" v-model="tempData.remark"></el-input>
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
  import systemTenantApi from '@/api/system/tenant'

  export default {
    name: 'TenantddEdit',
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
          tenantName: null,
          remark: null,
          tenantId: null
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
        rules: {
          tenantName: [
            { required: true, message: '请输入租户名称', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      dialogVisible: function(val) {
        if (val) {
          this.initTenantId()
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
      initTenantId() {
      },
      handleCreated: function(ztreeObj) {
        this.ztreeObj = ztreeObj
        this.ztreeObj.expandAll(true)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let checked =true
            let subData = {
              tenantName: this.tempData.tenantName,
              remark: this.tempData.remark,
              tenantId:this.tempData.tenantId,
            }
            if (this.tempData.id) {
              subData.id = this.tempData.id
              systemTenantApi.update(subData).then(res => {
                this.$message.success('更新成功')
                this.close()
              })
            } else {
              systemTenantApi.save(subData).then(res => {
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
        this.$refs['ruleForm'].clearValidate()
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>

</style>
