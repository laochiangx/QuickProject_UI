<template>
  <div>

    <!-- 卡片区 -->
    <el-card>
        <el-row :gutter="20">
            <!-- 左侧树形菜单区 -->
            <el-col :span="4">
                <el-tree
                  class="filter-tree"
                  :data="orgTreeData"
                  :props="defaultProps"
                  default-expand-all
                  :filter-node-method="filterNode"
                  @node-click="orgTreeClick"
                  ref="tree">
                </el-tree>
            </el-col>
            <el-col :span="20">
                <!-- 表格区 -->
                <el-table size="mini" :data="this.page.tableData" border stripe class="user_table" :header-cell-style="{background:'#F2F6FC'}">
                  <el-table-column align="center" prop="name" label="属性名称" width="150"></el-table-column>
                  <el-table-column align="center" prop="description" label="属性值" ></el-table-column>
                        <el-table-column label="是否可读" prop="readable" width="110px" align="center">
                      <template v-slot="scope">
                      <el-tag v-if="scope.row.readable===true" type="success">是</el-tag>
                      <el-tag v-if="scope.row.readable===false" type="failure">否</el-tag>
                      </template>
                    </el-table-column>
                        <el-table-column label="是否可写" prop="writable" width="110px" align="center">
                      <template v-slot="scope">
                      <el-tag v-if="scope.row.writable===true" type="success">是</el-tag>
                      <el-tag v-if="scope.row.writable===false" type="failure">否</el-tag>
                      </template>
                    </el-table-column>
                       <el-table-column align="center" prop="type" label="类型" ></el-table-column>
                </el-table>

                <!-- 分页区 -->
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="this.page.currentPage"
                  :page-sizes="[5, 10, 15, 20]"
                  :page-size="this.page.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="this.page.total"
                ></el-pagination>
            </el-col>
        </el-row>
    </el-card>
  </div>
</template>
<script>
import systemUserApi from '@/api/system/user'
import systemjvmApi from '@/api/system/jvm'
import systemInfoApi from "@/api/system/systemInfo";
import axios from 'axios';
import { mapActions } from "vuex";
export default {
    filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
        title: '',
        orgs:[],
        roles: [],
        orgTreeData: [],
        RtableData: [],
        userDialog: false,
        userForm: {
            status: true,
        },
        page:{
            tableData: [],
            pageSize: 10,
            total: 0,
            currentPage: 1,
        },
        fullName:'JMImplementation:type=MBeanServerDelegate',
        queryInfo: {
            size: 0,
            current: 0,
            username: '',
            orgId: '',
        },
        orgTreeKey: false,
        defaultProps: {
            children: 'children',
            label: 'title'
        },
        elTreeProps:{// el-tree-select配置项（必选）
            value: 'id',
            label: 'name',
            children: 'children',
        },
    };
  },

  mounted() {
    this.getList(),
    this.getPropertiesDate()
  },
  methods: {

    filterNode(value, data) {
        if (!value) return true;
        return data.orgName.indexOf(value) !== -1;
    },
    // 点击树的节点
    orgTreeClick(data, node, obj){
    this.fullName=data.key;
    this.getPropertiesDate()
    },
    // 修改每页显示条数
    handleSizeChange(size) {
       this.getPropertiesDate()
    },
	// 修改当前第几页
    handleCurrentChange(current) {
        this.getPropertiesDate()
    },
    getList() {
            const url = systemjvmApi.getDomains //'http://localhost:11010/bean/domains';
            axios.get(url).then(
                response => {
                    const result = response.data;
                    this.orgTreeData = result.data || []
                }
            ).catch(
                response => {
                    alert('请求失败');
                },
            );
        },

         getPropertiesDate() {
            this.RtableData=[]
            const url = systemjvmApi.getProperties //'http://localhost:11010/bean/domains';
            axios.get(url,{
                    params:{
                        fullName:this.fullName
                    }
                }).then(
                response => {
                    const result = response.data.data.beanAttributeInfos;
                     console.log(result)
                    this.page.tableData = result || []
                    this.page.total =10
                    let newFilArr = result.filter( (item,i) =>{
                        this.page.total =i
                        this.RtableData.push(item.attributeInfo)
                    } )
                    this.page.tableData = this.RtableData || []
                    console.log(this.RtableData)
                }
            ).catch(
                response => {
                    alert('请求失败');
                },
            );
    },
    getOrg(datas){ //递归遍历树，获取list
      for(var i in datas){
        this.orgs.push({orgId: datas[i].id, orgName: datas[i].orgName})
        if(datas[i].children){
          this.getOrg(datas[i].children);
        }
      }
    },
    handleAddTreeSelected(data){
      this.userForm.orgId = data.id
      this.userForm.orgName = data.orgName
      this.orgTreeKey = false
    },

    //封装分页请求通用方法
    async queryPage(orgId,username,size,current){
        let res = await this.userPage(this.copyQueryValue(orgId,username,size,current));
        this.copyPageValue(res)
    },
    //---------- 工具方法 -----------
    	//封装查询参数
	copyQueryValue(orgId,username,size,current){
		return {
			username: username?username:null,
            orgId: orgId?orgId:null,
			size: size?size:null,
			current: current?current:null,
		}
	},
    //刷新界面
    flush() {
      this.queryPage('','',this.page.pageSize,'')
    },
  }
};
</script>

