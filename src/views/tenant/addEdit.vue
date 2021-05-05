<template>
  <el-dialog
    class="simple-dialog"
    title="用户信息"
    :visible.sync="tempVisible"
    width="500px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form ref="formName" :rules="rules" :model="tempData" label-width="100px">
      <el-form-item label="租户名称:" prop="name">
        <el-input v-model="tempData.name" placeholder="3-12位字符" />
      </el-form-item>
      <el-form-item label="app_id:" prop="appId">
        <el-input v-model="tempData.appId" placeholder="6-18位字符" :disabled="tempData.id&&null!==tempData.id" />
      </el-form-item>
      <el-form-item label="32位密钥:" prop="appSecret">
        <el-input v-model="tempData.appSecret" placeholder="32位字符" />
      </el-form-item>
      <el-form-item label="QPS:" prop="qps">
        <el-input v-model="tempData.qps" placeholder="默认0，无限制" />
      </el-form-item>
      <el-form-item label="日请求限制:" prop="dayLimit">
        <el-input v-model="tempData.dayLimit" placeholder="默认0，无限制" />
      </el-form-item>
      <el-form-item label="总请求量:" prop="totalLimit">
        <el-input v-model="tempData.totalLimit" placeholder="默认0，无限制" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="saveUpdate('formName')">
        <span v-if="this.tempData.id">确认修改</span>
        <span v-else>确认添加</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import systemUserApi from '@/api/tenant/user'

export default {
  name: 'AddEdit',
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
      tempVisible: false,
      roles: [],
      tempData: {
        id: null,
        name: null,
        appId: null,
        appSecret: null,
        qps: null,
        dayLimit: null,
        totalLimit: null
      },
      rules: {
        name: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        appId: [
          { required: true, message: '请输入app_id', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        appSecret: [
          { min: 32, max: 32, message: '长度在 32 个字符', trigger: 'blur' }
        ],
        qps: [
          { type: 'number', message: 'qps必须为数字', trigger: 'blur' }
        ],
        dayLimit: [
          { type: 'number', message: '日请求量必须为数字', trigger: 'blur' }
        ],
        totalLimit: [
          { type: 'number', message: '累计请求量必须为数字', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialogVisible: function(val) {
      this.tempVisible = val
    },
    data: function(val) {
      this.tempData = val
    }
  },
  mounted() {

  },
  methods: {
    close() {
      this.$refs['formName'].clearValidate()
      this.$emit('close')
    },
    saveUpdate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const temp = {
            name: this.tempData.name,
            appSecret: this.tempData.appSecret,
            qps: this.tempData.qps,
            dayLimit: this.tempData.dayLimit,
            totalLimit: this.tempData.totalLimit
          }
          if (this.tempData.id) {
            temp.id = this.tempData.id
            systemUserApi.update(temp).then(res => {

            }).catch(() => {

            })
          } else {
            temp.appId = this.tempData.appId
            systemUserApi.save(temp).then(res => {

            }).catch(() => {

            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .add-edit {
    .el-dialog {
      .el-dialog__body {
        padding: 10px 20px 0 20px !important;
      }
    }
  }
</style>
