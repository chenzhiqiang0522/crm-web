<template>
    <section>
        <!--工具条-->
        <el-col :span = "24" class = "toolbar" style = "padding-bottom: 0px;">
            <el-form :inline = "true" :model = "filters">
                <el-form-item>
                    <el-input v-model = "filters.keyword" placeholder = "查询关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type = "primary" v-on:click = "search()">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type = "primary" @click = "handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--员工设置列表-->
        <el-table :data = "employees" highlight-current-row v-loading = "listLoading" @selection-change = "selsChange"
                  style = "width: 100%;">
            <el-table-column type = "selection" width = "55">
            </el-table-column>
            <el-table-column type = "index" width = "60">
            </el-table-column>
            <el-table-column prop = "username" label = "员工名字" width = auto sortable>
            </el-table-column>
            <el-table-column prop = "password" label = "密码" width = auto" sortable>
            </el-table-column>
            <el-table-column prop = "email" label = "电子邮件" width = auto sortable>
            </el-table-column>
            <el-table-column prop = "headImage" label = "头像" width = auto sortable>
            </el-table-column>
            <el-table-column prop = "age" label = "年龄" width = auto sortable>
            </el-table-column>
            <el-table-column prop = "parentDepartmentName" label = "所属部门" width = auto sortable>
            </el-table-column>
            <el-table-column label = "操作" width = auto>
                <template scope = "scope">
                    <el-button size = "small" @click = "handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type = "danger" size = "small" @click = "handleDel(scope.$index, scope.row)">删除</el-button>
                    <el-button type = "warning" size = "small" @click = "handleRole(scope.$index, scope.row)">设置角色</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span = "24" class = "toolbar">
            <el-button type = "danger" @click = "batchRemove" :disabled = "this.sels.length===0">批量删除</el-button>
            <el-pagination layout = "prev, pager, next" @current-change = "handleCurrentChange"
                           :page-size = "queryObject.pageSize"
                           :total = "total" style = "float:right;">
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog title = "新增" v-bind:visible.sync = "saveFormVisible" :close-on-click-modal = "false">
            <el-form :model = "saveForm" label-width = "80px" :rules = "saveFormRules" ref = "saveForm">
                <el-form-item label = "员工名字" prop = "username">
                    <el-input v-model = "saveForm.username" auto-complete = "on"></el-input>
                </el-form-item>
                <el-form-item label = "密码" prop = "password" v-if = "saveForm.id == null || saveForm.id == ''">
                    <el-input v-model = "saveForm.password" auto-complete = "on"></el-input>
                </el-form-item>
                <el-form-item label = "电子邮箱" prop = "email">
                    <el-input v-model = "saveForm.email" auto-complete = "on"></el-input>
                </el-form-item>
                <el-form-item label = "头像" prop = "headImage">
                    <el-input v-model = "saveForm.headImage" auto-complete = "on"></el-input>
                </el-form-item>
                <el-form-item label = "年龄" prop = "age">
                    <el-input v-model = "saveForm.age" auto-complete = "on"></el-input>
                </el-form-item>
                <el-form-item label = "所属部门" prop = "departmentId">
                    <el-input v-model = "saveForm.departmentId" auto-complete = "on"></el-input>
                </el-form-item>


            </el-form>
            <div slot = "footer" class = "dialog-footer">
                <el-button @click.native = "saveFormVisible = false">取消</el-button>
                <el-button type = "primary" @click = "addSubmit" :loading = "addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--设置权限界面-->
        <el-dialog title = "角色设置" v-bind:visible.sync = "saveRoleVisible" :close-on-click-modal = "false">
            <el-form :model = "roleForm" label-width = "80px" ref = "saveForm">
                <el-form-item label = "员工角色" prop = "role">
                    <el-radio-group v-model = "role" @change = "roleChange">
                        <el-radio v-for = "item in roles" :label = "item.id">{{ item.name }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot = "footer" class = "dialog-footer">
                <el-button @click.native = "saveRoleVisible = false">取消</el-button>
                <el-button type = "primary" @click = "addRoleSubmit" :loading = "addRoleLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
// import util from '../../common/js/util'
//import NProgress from 'nprogress'
// import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

import role from "../permission/Role.vue";

export default {
    data() {
        return {
            roleForm:{
                employeeId:'',
                roleId:''
            },
            role:'',
            saveRoleVisible:false,
            options: [],
            optionsValue: '',
            filters: {
                keyword: ''
            },
            employees: [],
            total: 0,
            page: 1,
            listLoading: false,
            sels: [],//列表选中列
            selsId: [],
            roles:[],
            saveFormVisible: false,//新增界面是否显示
            addLoading: false,
            addRoleLoading:false,
            saveFormRules: {
                name: [
                    {required: true, message: '请输入姓名', trigger: 'blur'}
                ]
            },
            //新增、修改界面数据
            saveForm: {
                id: '',
                username: '',
                password: '',
                email: '',
                headImage: '',
                age: '',
                departmentId: ''

            },
            cascaderOptions: [],
            queryObject: {
                keyword: '',
                currentPage: 1,
                pageSize: 5
            }

        }
    },
    methods: {
        handleCurrentChange(val) {
            this.page = val;
            // console.log("val",val)
            this.queryObject.currentPage = val
            this.getEmployees()
        },
        search() {
            debugger
            this.queryObject.keyword = this.filters.keyword
            this.page = 1
            this.queryObject.currentPage = this.page
            this.getEmployees()
        },
        //获取用户列表
        getEmployees() {
            // console.log(this.queryObject)
            this.$http.post("/Employees/pageList", this.queryObject)
                .then(result => {
                    console.log("result(EmployeePageList)",result)
                    if (result.data.success){
                        result = result.data
                        console.log("EmployeePageList",result)
                        this.total = result.resultObj.total
                        this.employees = result.resultObj.rows
                    }else{
                        this.$message({
                            message: result.data.msg,
                            type: 'error'
                        })
                    }
                })
                .catch(result => {
                    this.$message({
                        message: '网络出现错误!请稍后再试',
                        type: 'error'
                    })
                })
        },
        getDepartmentTree() {
            // console.log(this.queryObject)
            this.$http.get("/Departments/departmentTree")
                .then(result => {
                    console.log("resultObj", result.data.resultObj)
                    this.cascaderOptions = result.data.resultObj
                    console.log("cascaderOptions", this.cascaderOptions)
                })
                .catch(result => {
                    this.$message({
                        message: '网络出现错误!请稍后再试',
                        type: 'error'
                    })
                })
        },
        //删除
        handleDel: function (index, row) {
            console.log("删除对象的id", row.id)
            this.$confirm('确认删除该员工吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                this.$http.delete("/Employees/deleteById/" + row.id)
                    .then(result => {
                        result = result.data
                        this.listLoading = false;
                        this.$message({
                            message: result.msg,
                            type: 'success'
                        })
                        this.queryObject.currentPage = 1
                        this.getEmployees()
                        // console.log(result.data)

                    })
            }).catch(() => {

            });
        },
        getAllRoles:function (){
            this.$http.get("/Roles")
                .then(result => {
                    result = result.data;
                    console.log("AllRoles",result.resultObj)
                    this.roles = result.resultObj;
                })
                .catch(result => {

                })
        },
        //设置员工角色
        handleRole:function(index, row){
            this.$http.get("/Employees/getRoleByEmployeeId/"+row.id)
                .then(result => {
                    result = result.data
                    this.role = result.resultObj
                })
            this.saveRoleVisible = true
            console.log("row",row)
            this.roleForm.employeeId = row.id
        },
        roleChange:function (){
            console.log("roleId",this.role)
            this.roleForm.roleId = this.role
        },
        addRoleSubmit:function (){

            this.$confirm('确认提交吗？', '提示', {}).then(() => {
                this.addRoleLoading = true
                console.log("最后roleForm", this.roleForm)
                this.$http.post("/Employees/addRoleToEmplyee",this.roleForm)
                    .then(result => {
                        result= result.data
                        if (result.success){
                            this.addRoleLoading = false
                        }else{
                            this.$message({
                                type:"error",
                                message:"角色赋权失败"
                            })
                        }
                    })
                    .catch(()=>{
                        this.$message({
                            type:"error",
                            message:"网络出错"
                        })
                    })
            })
        },
        //显示编辑界面
        handleEdit: function (index, row) {
            this.getEmployees();
            // this.getDepartmentTree()
            console.log("row", row)
            this.saveForm = Object.assign({}, row);
            console.log("未修改saveForm", this.saveForm)
            this.saveFormVisible = true;
        },
        //显示新增界面
        handleAdd: function () {
            this.saveFormVisible = true;
            this.getEmployees();
            this.getDepartmentTree()
            this.optionsValue = 0
        },
        // 保存表单数据
        editSubmit: function (saveType) {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        let array = this.saveForm.parent;
                        if (array && array.length > 0) {
                            this.saveForm.parent = {
                                id: array[array.length - 1]
                            }
                        } else {
                            this.saveForm.parent = {id: null}
                        }
                        this.$http.post("/Departments/add", this.saveForm)
                            .then(result => {
                                result = result.data
                                this.addLoading = false
                                console.log("result", result)
                                if (result.success) {
                                    this.$message({
                                        message: '操作成功!',
                                        type: 'success'
                                    });
                                    this.saveFormVisible = false;
                                    this.getDepartments();
                                    this.saveForm={
                                        id: '',
                                        username: '',
                                        password: '',
                                        email: '',
                                        headImage: '',
                                        age: '',
                                        departmentId: ''

                                    }
                                } else {
                                    this.$message({
                                        message: result.msg,
                                        type: 'error'
                                    });
                                }

                            })
                            .catch(result => {
                                this.$message({
                                    message: '网络错误!',
                                    type: 'error'
                                });
                            })
                    });
                }
            });
        },
        //新增
        addSubmit: function () {
            console.log("提交saveForm", this.saveForm)
            console.log("提交optionsValue", this.optionsValue)
            this.$refs.saveForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        console.log("最后saveForm", this.saveForm)
                        if (this.saveForm.id == null || this.saveForm.id == '') {
                            this.$http.post("/Employees/addEmployee", this.saveForm)
                                .then(result => {
                                    let tempForm = this.saveForm
                                    result = result.data
                                    this.addLoading = false
                                    console.log("result", result)
                                    if (result.success) {
                                        this.$message({
                                            message: '操作成功!',
                                            type: 'success'
                                        });
                                        this.saveForm = {
                                            username: '',
                                            password: '',
                                            email: '',
                                            headImage: '',
                                            age: '',
                                            departmentId: ''
                                        };
                                        this.saveFormVisible = false;
                                        this.getEmployees()
                                    } else {
                                        this.addLoading = false
                                        this.$message({
                                            message: result.msg,
                                            type: 'error'
                                        });
                                    }

                                })
                                .catch(result => {
                                    this.addLoading = false
                                    this.$message({
                                        message: '网络错误!',
                                        type: 'error'
                                    });
                                })
                        } else {
                            this.$http.post("/Employees/modifyEmployee", this.saveForm)
                                .then(result => {
                                    result = result.data
                                    this.addLoading = false
                                    console.log("result", result)
                                    if (result.success) {
                                        this.$message({
                                            message: '操作成功!',
                                            type: 'success'
                                        });
                                        this.saveFormVisible = false;
                                        this.getEmployees()
                                    } else {
                                        this.$message({
                                            message: result.msg,
                                            type: 'error'
                                        });
                                    }

                                })
                                .catch(result => {
                                    this.addLoading = false
                                    this.$message({
                                        message: '网络错误!',
                                        type: 'error'
                                    });
                                })
                        }
                    });
                }
            });
        },
        selsChange: function (sels) {
            this.sels = sels;
        },
        //批量删除
        batchRemove: function () {
            var ids = this.sels.map(item => item.id)
            this.$confirm('确认删除选中员工信息吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                //NProgress.start();
                let para = {ids: ids};
                console.log("para", para.ids)
                this.$http.patch("/Employees/patchDelete", para.ids)
                    .then(result => {
                        debugger
                        this.$message({
                            type: "success",
                            message: result.data.msg
                        })
                        this.getEmployees()
                        this.listLoading = false;
                    })
                    .catch(() => {
                        this.$message({
                            type: "error",
                            message: "网络开小差啦，请稍后再试!"
                        })
                        this.listLoading = false;
                    })
            });
        },
    },
    mounted() {
        this.getEmployees()
        this.getAllRoles()

    }
}

</script>

<style scoped>

</style>