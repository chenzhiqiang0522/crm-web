<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="关键字"></el-input>
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
		<el-table :data="roles" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="auto">
			</el-table-column>
			<el-table-column prop="name" label="角色名" width="auto" sortable>
			</el-table-column>
			<el-table-column prop="sn" label="角色标识" width="auto" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="queryObj.pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
<!--		<el-dialog title="编辑" v-model :visible.sync="editFormVisible" :close-on-click-modal="false">-->
		<el-dialog title="编辑" v-bind:visible.sync="saveFormVisible" :close-on-click-modal="false">
			<el-form :model="saveForm" label-width="80px" :rules="saveFormRules" ref="editForm">
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="saveForm.name" auto-complete="on"></el-input>
				</el-form-item>
				<el-form-item label="角色标识" prop="sn">
					<el-input v-model="saveForm.sn" auto-complete="on"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="saveFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="saveSubmit" :loading="saveLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	// import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	// import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				roles: [],
				total: 0,
				listLoading: false,
				sels: [],//列表选中列
				queryObj: {
					keyword: '',
					currentPage: 1,
					pageSize: 4
				},
				saveFormVisible: false,//编辑界面是否显示
				saveLoading: false,
				saveFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					sn:[
						{ required: true, message: '请输入唯一标识', trigger: 'blur' }
					]
				},
				//编辑、新增界面数据
				saveForm: {
					id:null,
					name:'',
					sn:''
				},
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					sn:[
						{ required: true, message: '请输入唯一标识', trigger: 'blur' }
					]
				},
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			// 页码切换
			handleCurrentChange(val) {
				this.page = val;
				this.queryObj.currentPage = val
				this.getAllRoles()
			},
			//获取角色列表
			getAllRoles() {
				this.listLoading = true
				this.$http.post("/Roles/pageList",this.queryObj)
						.then(result => {
							result = result.data
							console.log("result", result)
							this.roles = result.resultObj.rows
							this.total = result.resultObj.total
							this.listLoading = false
						})
			},
			search(){
				this.queryObj.keyword = this.filters.name
				this.getAllRoles()
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该角色吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面,数据回显
			 handleEdit: function (index, row) {
				this.saveFormVisible = true;
				this.saveForm = Object.assign({}, row); 		// 回显方式一
				//  this.saveForm = row														// 回显方式二
				 console.log('saveForm',this.saveForm)
			},
			//显示新增界面
			handleAdd: function () {
				this.saveFormVisible = true;
				this.saveForm = {
					id:null,
					name:'',
					sn:''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.saveLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.saveLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.saveFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			// 保存提交
			saveSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.saveLoading = true;
							if (this.saveForm.id == ''|| this.saveForm.id == null){
								this.$http.post('/Roles/addRole',this.saveForm)
										.then(result => {
											result = result.data
											this.$message({
												type:"success",
												message:result.msg
											})
											this.search();
											this.saveLoading = false;
											// console.log(result.msg)
										})
										.catch(()=>{
											this.$message({
												type:"error",
												message:"网络出错啦，请稍后再试"
											})
										})
								this.saveFormVisible = false;
							}else{
								this.$http.post('/Roles/upadateRole',this.saveForm)
										.then(result => {
											result = result.data
											this.$message({
												type:"success",
												message:result.msg
											})
											this.search();
											this.saveLoading = false;
											// console.log(result.msg)
										})
										.catch(()=>{
											this.$message({
												type:"error",
												message:"网络出错啦，请稍后再试"
											})
										})
								this.saveFormVisible = false;
							}
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.saveLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.saveLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.saveFormVisible = false;
								this.getUsers();
							});
						})
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getAllRoles();
		}
	}

</script>

<style scoped>

</style>