<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="查询关键字"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="search">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="allPermissions" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="权限名称" width="auto" sortable>
			</el-table-column>
			<el-table-column prop="url" label="权限URL" width="auto" sortable>
			</el-table-column>
			<el-table-column prop="descs" label="权限描述" width="auto" sortable>
			</el-table-column>
			<el-table-column prop="sn" label="权限标识" width="auto" sortable>
			</el-table-column>
			<el-table-column prop="parentId" label="父级权限" min-width="auto" sortable>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="queryObj.pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>


	</section>
</template>

<script>
	export default {
		data() {
			return {
          filters: {
              name: ''
          },
          allPermissions: [],
          queryObj: {
              keyword: '',
              currentPage: 1,
              pageSize: 4
          },
          total: 0,
          page: 1,
          listLoading: false,
          sels: [],//列表选中列

          editFormVisible: false,//编辑界面是否显示
          editLoading: false,
          //编辑界面数据
          editForm: {
              id: 0,
              name: '',
              sex: -1,
              age: 0,
              birth: '',
              addr: ''
          },

          addFormVisible: false,//新增界面是否显示
          addLoading: false,
          addFormRules: {
              name: [
                  {required: true, message: '请输入姓名', trigger: 'blur'}
              ]
          }
      }
		},
		methods: {
        getAllPermissions() {
            this.listLoading = true;
					console.log(this.queryObj)
            this.$http.post("/Permissions/pageList", this.queryObj)
                .then(result => {
									debugger
                    this.listLoading = false
                    result = result.data
                    console.log("resultObj", result.resultObj)
                    this.allPermissions = result.resultObj.rows
                    this.total = result.resultObj.total
                })
                .catch(result => {
                    this.$message({
                        message: "网络开小差啦，请稍后再试！",
                        type: "error"
                    })
                })
        },
        handleCurrentChange(val) {
            this.queryObj.currentPage = val
            this.getAllPermissions()
        },
        search() {
            this.listLoading = true
            this.queryObj = {
                keyword: this.filters.name,
                currentPage: 1,
                pageSize: 4
            }
            console.log(this.queryObj)
            this.getAllPermissions()
        },
        //显示编辑界面
        handleEdit: function (index, row) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        //显示新增界面
        handleAdd: function () {
            this.addFormVisible = true;
            this.addForm = {
                name: '',
                sex: -1,
                age: 0,
                birth: '',
                addr: ''
            };
        },
    },
		mounted() {
			this.getAllPermissions()
		}
	}

</script>

<style scoped>

</style>