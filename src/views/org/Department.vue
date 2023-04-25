<template >
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

        <!--列表-->
        <el-table :data = "departments" highlight-current-row v-loading = "listLoading" @selection-change = "selsChange"
                  style = "width: 100%;">
            <el-table-column type = "selection" width = "55">
            </el-table-column>
            <el-table-column type = "index" width = "60">
            </el-table-column>
            <el-table-column prop = "name" label = "部门名称" width = auto sortable>
            </el-table-column>
            <el-table-column prop = "intro" label = "介绍" width = auto" sortable>
            </el-table-column>
            <el-table-column prop = "createTime" label = "创建时间" width = auto sortable>
            </el-table-column>
            <el-table-column prop = "updateTime" label = "修改时间" width = auto sortable>
            </el-table-column>
            <el-table-column prop = "manager.username" label = "部门经理" width = auto sortable>
            </el-table-column>
            <el-table-column prop = "parent.name" label = "父级部门" width = auto sortable>
            </el-table-column>
            <el-table-column prop = "path" label = "管理路径" width = auto sortable>
            </el-table-column>
            <el-table-column label = "状态" width = auto sortable>
                <template scope="scope">
                    <el-tag
                        v-if = "scope.row.state==1"
                        :key = "items[0].label"
                        :type = "items[0].type"
                        size="medium"
                        effect = "plain">
                        {{ items[0].label }}
                    </el-tag>
                    <el-tag
                        v-else
                        :key = "items[1].label"
                        :type = "items[1].type"
                        size="medium"
                        effect = "plain">
                        {{ items[1].label }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label = "操作" width = auto>
                <template scope = "scope">
                    <el-button size = "small" @click = "handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type = "danger" size = "small" @click = "handleDel(scope.$index, scope.row)">删除
                    </el-button>
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
        <el-dialog title = "新增" v-bind:visible.sync="saveFormVisible" :close-on-click-modal = "false">
            <el-form :model = "saveForm" label-width = "80px" :rules = "saveFormRules" ref = "saveForm">
                <el-form-item label = "部门名称" prop = "name">
                    <el-input v-model = "saveForm.name" auto-complete = "off"></el-input>
                </el-form-item>
                <el-form-item label = "部门介绍">
                    <el-input type="textarea" rows="2" v-model = "saveForm.intro" ></el-input>
                </el-form-item>
                <el-form-item label = "状态">
                    <el-radio v-model="saveForm.state" :label="1" >正常</el-radio>
                    <el-radio v-model="saveForm.state" :label="0" >弃用</el-radio>
                </el-form-item>
                <el-form-item label = "部门经理">
                    <el-input v-model = "saveForm.manageId" ></el-input>
                </el-form-item>
                <el-form-item label = "父部门">
                    <el-input v-model = "saveForm.parentId" ></el-input>
                </el-form-item>

            </el-form>
            <div slot = "footer" class = "dialog-footer">
                <el-button @click.native = "saveFormVisible = false">取消</el-button>
                <el-button type = "primary" @click.native = "addSubmit" :loading = "addLoading">提交</el-button>
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
            items: [
                { type: 'success', label: '正常' },
                { type: 'danger', label: '弃用' },
            ],
            filters: {
                keyword: ''
            },
            departments: [],
            total: 0,
            page: 1,
            listLoading: false,
            sels: [],//列表选中列
            selsId: [],
            // editFormVisible: false,//编辑界面是否显示
            // editLoading: false,
            // editFormRules: {
            //     name: [
            //         {required: true, message: '请输入姓名', trigger: 'blur'}
            //     ]
            // },
            //编辑界面数据
            // editForm: {
            //     id: 0,
            //     name: '',
            //     sex: -1,
            //     age: 0,
            //     birth: '',
            //     addr: ''
            // },

            saveFormVisible: false,//新增界面是否显示
            addLoading: false,
            saveFormRules: {
                name: [
                    {required: true, message: '请输入姓名', trigger: 'blur'}
                ]
            },
            //新增界面数据
            saveForm: {
                name: '',
                intro:'',
                manageId:'',
                parentId: '',
                state: ''
            },
            queryObject: {
                keyword: '',
                currentPage: 1,
                pageSize: 10
            }

        }
    },
    methods: {
        //性别显示转换
        formatSex: function (row, column) {
            return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
        },
        handleCurrentChange(val) {
            this.page = val;
            // console.log("val",val)
            this.queryObject.currentPage = val
            this.getDepartments()
        },
        search() {
            this.queryObject.keyword = this.filters.keyword
            this.getDepartments()
        },
        //获取用户列表
        getDepartments() {
            // console.log(this.queryObject)
            this.$http.post("/Departments/pageList", this.queryObject)
                .then(result => {
                    // console.log("resultObj.rows",result.data.resultObj.rows)
                    // console.log("resultObj",result.data.resultObj)
                    this.departments = result.data.resultObj.rows
                    this.total = result.data.resultObj.total
                    console.log(this.departments)
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
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                this.$http.delete("/Departments/" + row.id)
                    .then(result => {
                        this.listLoading = false;
                        this.$message({
                            message: result.data.msg,
                            type: 'success'
                        })
                        this.queryObject.currentPage = 1
                        this.getDepartments()
                        // console.log(result.data)
                    })
            }).catch(() => {

            });
        },
        //显示编辑界面
        handleEdit: function (index, row) {
            this.saveForm = Object.assign({}, row);
            this.saveForm.state = row.state
            console.log(row)
            console.log(this.saveForm)
            console.log(typeof this.saveForm.state)
            this.saveFormVisible = true;
        },
        //显示新增界面
        handleAdd: function () {
            this.saveFormVisible = true;
            this.saveForm = {
                name: '',
                intro:'',
                manageId:'',
                parentId: '',
                state: ''
            };
        },
        //编辑
        editSubmit: function () {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.editForm);
                        para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                        editUser(para).then((res) => {
                            this.editLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs['editForm'].resetFields();
                            this.editFormVisible = false;
                            this.getUsers();
                        });
                    });
                }
            });
        },
        //新增
        addSubmit: function () {
            this.$refs.saveForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.saveForm);
                        para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                        addUser(para).then((res) => {
                            this.addLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs['saveForm'].resetFields();
                            this.saveFormVisible = false;
                            this.getUsers();
                        });
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
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                //NProgress.start();
                let para = {ids: ids};
                console.log("para", para.ids)
                this.$http.patch("/Departments/patchDelete", para.ids).then(result => {
                    this.$message({
                        type: "success",
                        message: result.data.msg
                    })
                    this.getDepartments()
                })
                    .catch(() => {
                        this.$message({
                            type: "error",
                            message: "网络开小差啦，请稍后再试!"
                        })
                    })
            });
        }
    },
    mounted() {
        this.getDepartments();
    }
}

</script>

<style scoped>

</style>