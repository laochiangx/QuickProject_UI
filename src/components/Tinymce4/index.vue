<template>
    <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
        <el-button @click="insertContent">插入内容</el-button>
        <el-button @click="getContent">获取内容</el-button>
        <label>
            <textarea :id="tinymceId" class="tinymce-textarea"/>
        </label>
        <el-dialog
                class="text-file-browser"
                title="文件浏览器"
                :visible.sync="fileBrowserVisible"
                width="820px">
            <file-list :height="400" :callback="true" @callback="fileSelected"/>
        </el-dialog>
    </div>
</template>

<script>
    /**
     * docs:
     * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
     */
    import plugins from './plugins'
    import toolbar from './toolbar'
    import load from './dynamicLoadScript'
    import FileList from "@/views/fileBrowse/components/fileList"
    import {isImg, isVideo} from '@/utils/file'
    import request from "@/utils/request";

    const localUrl = '/plugins/tinymce4/tinymce/tinymce.min.js'

    export default {
        name: 'Tinymce',
        components: {FileList},
        props: {
            id: {
                type: String,
                default: function () {
                    return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
                }
            },
            value: {
                type: String,
                default: 'hello'
            },
            toolbar: {
                type: Array,
                required: false,
                default() {
                    return []
                }
            },
            menubar: {
                type: String,
                default: 'file edit insert view format table'
            },
            height: {
                type: [Number, String],
                required: false,
                default: 360
            },
            width: {
                type: [Number, String],
                required: false,
                default: 'auto'
            }
        },
        data() {
            return {
                fileBrowserVisible: false,
                hasChange: false,
                hasInit: false,
                tinymceId: this.id,
                fullscreen: false,
            }
        },
        computed: {
            containerWidth() {
                const width = this.width
                if (/^[\d]+(\.[\d]+)?$/.test(width)) {
                    return `${width}px`
                }
                return width
            }
        },
        watch: {
            value(val) {
                if (!this.hasChange && this.hasInit) {
                    this.$nextTick(() =>
                        window.tinymce.get(this.tinymceId).setContent(val || ''))
                }
            }
        },
        mounted() {
            this.init()
        },
        activated() {
            if (window.tinymce) {
                this.initTinymce()
            }
        },
        deactivated() {
            this.destroyTinymce()
        },
        destroyed() {
            this.destroyTinymce()
        },
        methods: {
            init() {
                load(localUrl, (err) => {
                    if (err) {
                        this.$message.error(err.message)
                        return
                    }
                    this.initTinymce()
                })
            },
            initTinymce() {
                const _this = this
                window.tinymce.init({
                    selector: `#${this.tinymceId}`,
                    language: 'zh_CN',
                    height: this.height,
                    body_class: 'panel-body ',
                    object_resizing: false,
                    toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
                    menubar: this.menubar,
                    plugins: plugins,
                    powerpaste_word_import: 'propmt',// 参数可以是propmt, merge, clear，效果自行切换对比
                    powerpaste_html_import: 'propmt',// propmt, merge, clear
                    powerpaste_allow_local_images: true,
                    paste_data_images: true,
                    end_container_on_empty_block: true,
                    code_dialog_height: 450,
                    code_dialog_width: 1000,
                    default_link_target: '_blank',
                    link_title: false,
                    nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
                    init_instance_callback: editor => {
                        if (_this.value) {
                            editor.setContent(_this.value)
                        }
                        _this.hasInit = true
                        editor.fileBrowser = function () {
                            _this.fileBrowserVisible = true
                        }
                    },
                    setup(editor) {
                        editor.on('FullscreenStateChanged', (e) => {
                            _this.fullscreen = e.state
                        })
                    },
                    images_upload_handler(blobInfo, success, failure, progress) {
                        let formData = new FormData()
                        formData.append('prefix', '/')
                        formData.append('file', blobInfo.blob())
                        request({
                            url: '/system/file/richText',
                            method: 'post',
                            data: {data: formData, NOSERI: true, notLoading: true},
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then((res) => {
                            success(res.data.url)
                        }).catch((res) => {
                            failure((res && res.data && res.data.message) || '上传失败')
                        })
                    },
                    video_template_callback: function (data) {
                        return `<video controls="controls" style="max-width: 100%;">
                  <source src="${data.source1}" type="${data.source1mime}" /></video>`;
                    }
                })
            },
            destroyTinymce() {
                const tinymce = window.tinymce.get(this.tinymceId)
                if (this.fullscreen) {
                    tinymce.execCommand('mceFullScreen')
                }

                if (tinymce) {
                    tinymce.destroy()
                }
            },
            setContent(value) {
                window.tinymce.get(this.tinymceId).setContent(value)
            },
            getContent() {
                this.$message.success(window.tinymce.get(this.tinymceId).getContent())
            },
            insertContent(arr) {
                const _this = this
                window.tinymce.get(_this.tinymceId).insertContent(`<img src="https://dss1.baidu.com/70cFfyinKgQFm2e88IuM_a/forum/pic/item/a8ec8a13632762d0797a0962a6ec08fa503dc6a3.jpg"  alt="" />`);
            },
            fileSelected(data) {
                let _this = this
                let file = data || []
                file.forEach(item => {
                    if (isImg(item.url)) {
                        window.tinymce.get(_this.tinymceId).insertContent(`<img src="${item.url}"  alt="${item.name}" style="max-width: 100%;max-height: auto" />`);
                    } else if (isVideo(item.url)) {
                        window.tinymce.get(_this.tinymceId).insertContent(`<video controls="controls" style="max-width: 100%;">
                  <source src="${item.url}" /></video>`)
                    } else {
                        window.tinymce.get(_this.tinymceId).insertContent(`<p><a href="${item.url}" target="_blank" rel="noopener">${item.name}</a></p>`)
                    }
                })
                this.fileBrowserVisible = false
            }
        }
    }
</script>

<style lang="scss">
    .text-file-browser {
        .el-dialog {
            .el-dialog__body {
                padding: 10px 20px 20px 20px;
            }
        }
    }
</style>

<style scoped>
    .tinymce-container {
        position: relative;
        line-height: normal;
    }

    .tinymce-textarea {
        visibility: hidden;
        z-index: -1;
    }

</style>
