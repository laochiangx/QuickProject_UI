<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">

        <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
           <size-select id="size-select" class="right-menu-item hover-effect" />
         </el-tooltip>-->

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="hover">
        <div class="avatar-wrapper">
          <el-avatar size="small" :src="avatar + '?imageView2/1/w/80/h/80'" />
          <span class="login-user">{{userName}}<i class="el-icon-caret-bottom" /></span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="rePassVisible=true">
            <span style="display:block;"><svg-icon
              style="margin-right: 4px;"
              icon-class="repassword"
            />密码修改</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display:block;"><svg-icon
              style="margin-right: 4px;"
              icon-class="log-out"
            />退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tooltip content="全局大小设置" effect="dark" placement="bottom">
        <size-select id="size-select" class="right-menu-item hover-effect" />
      </el-tooltip>
      <span class="right-menu-item hover-effect" style="margin-right: 15px;" @click.stop="showPanel">
        <svg-icon icon-class="more" />
      </span>
    </div>
    <!--密碼修改-->
    <re-password
      :dialog-visible="rePassVisible"
      @close="closeDialog"
    />
    <right-panel ref="rightPanel">
      <settings />
    </right-panel>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import RightPanel from '@/components/RightPanel'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import SizeSelect from '@/components/SizeSelect'
import Settings from './Settings'
import rePassword from '@/components/RePassword/index'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    RightPanel,
    SizeSelect,
    Settings,
    rePassword
  },
  data() {
    return {
      rePassVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    userName() {
      return this.$store.getters.name || '管理员'
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      const that = this
      this.$confirm('是否退出登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async function() {
        await that.$store.dispatch('user/logout')
        await that.$router.push(`/login?redirect=${that.$route.fullPath}`)
      }).catch(() => {
      })
    },
    showPanel() {
      try {
        this.$refs.rightPanel.showRightPanel()
      } catch (e) {
      }
    },
    closeDialog() {
      this.rePassVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {

        .avatar-wrapper {
          margin-top: 8px;
          position: relative;

          .login-user {
            margin-left: 5px;
            font-size: 14px;
            display: inline-block;
            overflow: hidden;
            line-height: 28px;
          }
        }
      }
    }
  }
</style>
