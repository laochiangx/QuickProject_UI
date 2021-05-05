<template>
  <el-dialog
    class="reset-password"
    title="密码修改"
    :visible.sync="tempVisible"
    width="450px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    @close="close"
  >
    <el-form ref="formName" size="small" :rules="rules" :model="tempData" label-width="90px">
      <el-form-item label="新密码:" prop="newPassword">
        <el-input v-model="tempData.newPassword" show-password />
      </el-form-item>
      <el-form-item label="再次输入:" prop="onePassword">
        <el-input v-model="tempData.onePassword" show-password />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button size="small" type="primary" @click="resetPass('formName')">
        确认修改
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { resetPass } from '@/api/user'

export default {
  name: 'AddEdit',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.tempData.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      tempVisible: false,
      tempData: {
        newPassword: '',
        onePassword: ''
      },
      rules: {
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        onePassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialogVisible: function(val) {
      this.tempVisible = val
    }
  },
  mounted() {

  },
  methods: {
    close() {
      this.tempData = {
        newPassword: '',
        onePassword: ''
      }
      this.$refs['formName'].clearValidate()
      this.$emit('close')
    },
    resetPass(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          resetPass(this.tempData.newPassword).then(async function(res) {
            if (res.data && res.data === true) {
              await _this.$store.dispatch('user/logout')
              _this.$router.push(`/login?redirect=${_this.$route.fullPath}`)
            } else {
              this.$message.error('修改失败，请联系管理员')
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .reset-password {
    .el-dialog {
      .el-dialog__body {
        padding: 10px 20px 0 20px !important;
      }
    }
  }
</style>
