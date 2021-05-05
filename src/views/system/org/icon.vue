<template>
  <el-dialog
    class="simple-dialog"
    title="图标选择"
    :visible.sync="tempVisible"
    width="500px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    @close="close"
  >
    <div style="max-height: 300px;overflow-y: auto">
      <span :class="item===select?'selected':''" @click="select=item"
            style="cursor:pointer;display: inline-block;margin: 5px 8px 5px 0;font-size: 18px"
            v-if="item" v-for="(item) in iconList">
        <i v-if="item.indexOf('el-icon')!==-1" :class="item"></i>
        <svg-icon v-else :icon-class="item"/>
      </span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="selected">
        确定
      </el-button>
      <el-button size="small" @click="close">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'icon',
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      bindData: {
        type: Object,
        default: null
      },
      selectedIcon: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        tempVisible: false,
        select: '',
        iconList: [
          'dashboard',
          'system-user',
          'permission',
          'role',
          'menu',
          'tenant',
          'system-config',
          'biz',
          'el-icon-delete-solid',
          'el-icon-s-tools',
          'el-icon-user-solid',
          'el-icon-phone',
          'el-icon-more',
          'el-icon-star-on',
          'el-icon-s-goods',
          'el-icon-warning',
          'el-icon-question',
          'el-icon-info',
          'el-icon-picture',
          'el-icon-upload',
          'el-icon-camera-solid',
          'el-icon-video-camera-solid',
          'el-icon-message-solid',
          'el-icon-s-cooperation',
          'el-icon-s-platform',
          'el-icon-s-order',
          'el-icon-s-home',
          'el-icon-s-ticket',
          'el-icon-s-shop',
          'el-icon-s-marketing',
          'el-icon-s-flag',
          'el-icon-s-data',
          'el-icon-s-comment',
          'el-icon-s-check',
          'el-icon-s-opportunity',
          'el-icon-s-custom',
          'el-icon-folder',
          'el-icon-printer',
          'el-icon-paperclip',
          'el-icon-takeaway-box'
        ]
      }
    },
    watch: {
      bindData: function(val) {
        this.bindData = val
      },
      dialogVisible: function(val) {
        this.tempVisible = val
      },
      selectedIcon: function(val) {
        this.selectedIcon = val
      }
    },
    mounted() {

    },
    methods: {
      selected() {
        this.$emit('selected', { data: this.bindData, value: this.select })
        this.close()
      },
      close() {
        this.select = ''
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .selected {
    color: deepskyblue;
  }
</style>
