<template>
    <div class="index-pre-error">
        <i v-if="!exist" style="font-size: 30px" class="el-icon-warning"/>
        <p>{{errorText}}</p>
        <el-tag v-if="!exist" size="mini" @click="logout" style="cursor: pointer;">返回登录</el-tag>
    </div>
</template>

<script>

    import {mapGetters} from "vuex";

    export default {
        name: 'indexPre',
        data() {
            return {
                exist: false,
                errorText: '请稍后...'
            }
        },
        computed: {
            ...mapGetters([
                'permission_routes'
            ]),
        },
        mounted() {
            console.log("permission_routes")
            console.log(this.permission_routes)
            for (let i = 0; i < this.permission_routes.length; i++) {
                //这里可以自行判断
                if (this.permission_routes[i].meta && this.permission_routes[i].meta.title === '首页') {
                    this.exist = true
                    break
                }
            }
            if (!this.exist) {
                this.errorText = '该账户似乎未分配任何权限，请先分配后操作'
            } else {
                this.$router.replace('/index/console')
            }
            //如果menu为空，则该用户未配置菜单权限，默认首页是跳转到index/console，看router/index.js
            /*console.log("menu", menu.length)
            if (menu && menu.length < 1) {
                Message.error("该账户似乎未有任何菜单权限，请先分配后登录")
            }*/
        },
        methods: {
            async logout() {
                const that = this
                this.$confirm('是否退出登录？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async function () {
                    await that.$store.dispatch('user/logout')
                    await that.$router.push(`/login`)
                }).catch(() => {
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .index-pre-error {
        width: 500px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: #E6A23C;

        p > {
            font-size: 14px;
        }
    }
</style>
