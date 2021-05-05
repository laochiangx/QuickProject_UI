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
    <el-form ref="formName" :rules="rules" :model="tempData" label-width="70px">
      <el-form-item label="用户名:" prop="username">
        <el-input v-model="tempData.username" :disabled="tempData.id&&null!==tempData.id"/>
      </el-form-item>
      <el-form-item v-if="!(tempData.id&&null!==tempData.id)" label="密码:" prop="password">
        <el-input v-model="tempData.password"/>
      </el-form-item>
      <el-form-item label="昵称:">
        <el-input v-model="tempData.nickname"/>
      </el-form-item>
      <el-form-item label="电话:">
        <el-input v-model="tempData.phone"/>
      </el-form-item>
      <el-form-item label="角色:">
        <el-checkbox-group v-model="tempData.role">
          <el-checkbox v-for="r in roles" :label="r.id">{{ r.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态:">
        <el-switch v-model="tempData.status==1?true:false"/>
        <span v-if="tempData.status=1">启用</span>
        <span v-else>禁用</span>
      </el-form-item>
              <el-form-item label="所属部门">
              <el-input placeholder="请选择部门" v-model="orgName"  @focus="orgTreeKey=true"></el-input>
              <div v-if="orgTreeKey">
                  <el-tree
                  :data="orgTreeData"
                  :props="defaultProps"
                  default-expand-all
                  @node-click="handleAddTreeSelected"
                  ></el-tree>
              </div>
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
  import systemUserApi from '@/api/system/user'
  import roleApi from '@/api/system/role'
  import orgApi from '@/api/system/org'

  export default {
    name: 'UserAddEdit',
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
        orgs:[],
        orgId:null,
        orgName:null,
        userId:1,
        orgTreeData:[],
        orgTreeKey: false,
        defaultProps: {
            children: 'children',
            label: 'orgName'
        },
        tempData: {
          id: null,
          username: '',
          password: '',
          nickname: '',
          phone: '',
          role: [],
          userOrgId:'',
          isEnable: true
        },
        rules: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      dialogVisible: function(val) {
        if (val) {
          this.initRoles()
          this.getList()
        }
        this.tempVisible = val
      },
      data: function(val) {
        this.tempData = val
        this.userId=this.tempData.id;
      }
    },
    mounted() {
     
    },
    methods: {
      getList() {
        this.loading = true
        orgApi.listTree(this.listQuery).then(res => {
         this.orgTreeData = res.data || []
          this.loading = false
        }).catch(() => this.loading = false)
      },
      selectDefault() {
        if (this.tempData.id) {
          console.log('getOne')
          console.log(this.tempData)
          orgApi.getOne(Number(this.tempData.id)).then(res => {
            this.orgName = res.data.orgName 
          })
        }
      },
    handleAddTreeSelected(data){
      this.orgId = data.id
      this.orgName = data.orgName
      this.orgTreeKey = false
    },
      close() {
        this.$refs['formName'].clearValidate()
        this.$emit('close')
      },
      initRoles() {
        roleApi.list({ pageSize: 200 }).then(res => {
          this.roles = res.data || []
          this.selectDefault()
        })

      },
      saveUpdate(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const temp = {
              username: this.tempData.username,
              password: this.tempData.password,
              nickname: this.tempData.nickname,
              phone: this.tempData.phone,
              role: this.tempData.role,
              isEnable: this.tempData.isEnable,
              userOrgId: this.orgId 
            }
            if (this.tempData.id) {
              temp.id = this.tempData.id
              systemUserApi.update(temp).then(res => {
                this.$message.success('更新成功')
                this.close()
              }).catch(() => {

              })
            } else {
              systemUserApi.save(temp).then(res => {
                this.$message.success('添加成功')
                this.$emit('close')
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

</style>
