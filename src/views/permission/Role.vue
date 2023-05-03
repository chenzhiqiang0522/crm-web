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
			<el-table-column label="操作" width="auto">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					<el-button type="danger" size="small" @click="changePermission(scope.$index, scope.row)">设置权限</el-button>
					<el-button type="danger" size="small" @click="changePermission(scope.$index, scope.row)">设置菜单</el-button>
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

<!--		授权弹框-->
		<el-dialog title="设置权限" :visible.sync="setPermissionVisible" :close-on-click-modal="false">
			<el-form :model="rolePermission" label-width="80px" ref="setPermissionForm">
				<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
				<div class="checkbox-table" v-for="(p,indexkey) in permissionTree" :key="p.sn">
					<template>
						<el-checkbox class="check1" style="font-weight: 600;margin-bottom: 15px "
												 v-model='rolePermission.permissionSns' :label="p.sn"
												 @change='handleCheck(1,indexkey)'>
							{{p.name}}
						</el-checkbox>
						<div style="margin-bottom: 20px;">
							<div v-for="c in p.children" class="line-check" :key="c.sn"
									 style="display: inline-block; margin-left: 20px;margin-bottom: 20px;" >
								<el-checkbox class="check2" @change='handleCheck(2,indexkey)'
														 v-model="rolePermission.permissionSns" :label="c.sn">
									{{c.name}}
								</el-checkbox>
							</div>
						</div>
					</template>
				</div>
				{{rolePermission.permissionSns}}
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="setPermissionVisible = false">取消</el-button>
				<el-button type="primary" @click.native="saveRolePermission" :loading="saveLoading">提交</el-button>
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
				permissionTree:[],		// 获取权限树，包括一级权限和一级权限所对应的二级权限
				checkAll:[],
				isIndeterminate:false,
				allPermissionSns:[],		// 全部权限的sn
				rolePermission: {
					roleId:null,
					permissionSns:[]		// 已选中权限的sn
				},
				setPermissionVisible:false,
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
			saveRolePermission(){
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					this.saveLoading = true;
					//NProgress.start();
					let para = this.rolePermission
					this.$http.post("/Roles/setPermission",para)
							.then(result => {
								result = result.data
								this.saveLoading = false
								if (result.success){
									this.$message({
										type:"success",
										message:"权限设置成功"
									})
									this.setPermissionVisible = false
								}else{
									this.$message({
										type:"error",
										message:result.msg
									})
								}
							})
				});
			},
			changePermission(index, row){
				this.setPermissionVisible = true
				// this.getPermissionTree()
				this.rolePermission.roleId = row.id
				this.getPermissionByRoleId(row.id)
			},
			getPermissionByRoleId(roleId){
				this.$http.get("/Roles/getPermissionSns/"+roleId)
						.then(result => {
							result = result.data
							if (result.success){
								this.rolePermission.permissionSns = result.resultObj
							}
							let checkedCount = this.rolePermission.permissionSns.length;
							this.checkAll = checkedCount === this.allPermissionSns.length;
							this.isIndeterminate = checkedCount > 0 && checkedCount < this.allPermissionSns.length;
						})
			},
			getPermissionTree(){
				// 获取一级权限和二级权限
				this.$http.get("/Permissions/permissionTree")
						.then(result => {
							result = result.data
							console.log("permissionTree",result)
							if (result.success){
								this.permissionTree = result.resultObj
								if (this.permissionTree && this.permissionTree.length>0){
									for (let i = 0; i < this.permissionTree.length; i++) {
										this.allPermissionSns.push(this.permissionTree[i].sn)
										let children = this.permissionTree[i].children
										for (let j = 0; j < children.length; j++) {
											this.allPermissionSns.push(children[j].sn)
										}
									}
								}
							}else {
								this.$message({
									type:"error",
									message:"权限查询失败"
								})
							}
						})
			},
			handleCheckAllChange(val){
				this.rolePermission.permissionSns = val ? this.allPermissionSns : [];
				this.isIndeterminate = false;
			},
			// 处理选择事件  type 1:一级权限2:二级权限   a：一级权限的索引位置
			handleCheck(type, a = 0) { // 多选框
				// 在已选中的权限列表中，查看是否存在一级权限 >-1 存在  <0 不存在
				let indexOf = this.rolePermission.permissionSns.indexOf(this.permissionTree[a].sn);
				if (type == 2) { // 二级菜单点击
					let index = 0;  //
					this.permissionTree[a].children.map(item => {
						// 已选中的权限列表中，是否包含当前一级权限下的某个子权限
						if (this.rolePermission.permissionSns.indexOf(item.sn) > -1) {
							index += 1;
						}
					})
					if (index > 0) {  // 已选中的权限列表中，包含当前一级权限下的某个子权限
						if (indexOf < 0) {  // 已选中的权限列表中，没有当前一级权限，则添加到已选中的权限列表中
							this.rolePermission.permissionSns.push(this.permissionTree[a].sn);
						}
					} else {  // // 已选中的权限列表中，不包含当前一级权限下的某个子权限
						if (indexOf > -1) {// 已选中的权限列表中，有当前一级权限，则删除
							this.rolePermission.permissionSns.splice(indexOf, 1);
						}
					}
				} else {  // 一级菜单点击
					if (indexOf > -1) { // 已选中的权限中，包含当前一级权限，则将该一级权限下所有的子权限选中
						this.permissionTree[a].children.map(item => {
							if (this.rolePermission.permissionSns.findIndex((n) => n == item.sn) < 0) {
								this.rolePermission.permissionSns.push(item.sn)
							}
						})
					} else {
						// 已选中的权限中，不包含当前一级权限，则将该一级权限下所有的子权限移除
						this.permissionTree[a].children.map(item => {
							if (this.rolePermission.permissionSns.findIndex((n) => n == item.sn) > -1) {
								this.rolePermission.permissionSns.splice(this.rolePermission.permissionSns.findIndex((n) => n == item.sn), 1);
							}
						})
					}
				}
				// 获取已选中的长度
				let checkedCount = this.rolePermission.permissionSns.length;
				// 如果已选中的长度==所有权限的长度，则checkAll=true，也就是全选框被选中
				this.checkAll = checkedCount === this.allPermissionSns.length;
				// 如果已选中的长度>0并且已选中的长度<所有权限的长度，则全选框是一个横杠
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.allPermissionSns.length;
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
				// console.log(sels)
				this.sels = sels;
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该角色吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					this.$http.delete("/Roles/"+row.id)
							.then(result => {
								this.$message({
									type:"success",
									message:result.data.msg
								})
								this.getAllRoles()
								this.listLoading = false
							})
							.catch(()=>{
								this.$message({
									type:"error",
									message:"网络出错啦，请稍后再试"
								})
							})
				}).catch(() => {

				});
			},
			//批量删除
			batchRemove: function () {
				this.listLoading = true
				var ids = this.sels.map(item => item.id);
				// console.log("ids",ids)
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					// let idsObj = {ids:ids}
					this.$http.patch("/Roles/patchDeleteRoles",ids)
							.then(result =>{
								result = result.data
								this.$message({
									type:"success",
									message:result.msg
								})
								this.getAllRoles()
								this.listLoading = false
							})
							.catch(result => {
								this.listLoading = false
								this.$message({
									type:"error",
									message:"网络出错啦，请稍后再试"
								})
							})
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getAllRoles();
			this.getPermissionTree()
		}
	}

</script>

<style scoped>

</style>