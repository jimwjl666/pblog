<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="types" highlight-current-row v-loading="listLoading"  style="width: 100%;">

      <el-table-column type="index" width="100">
      </el-table-column>
      <el-table-column prop="typeName" label="分类名称" width="200">
      </el-table-column>
      <el-table-column prop="count" label="文章数量" width="200">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editFormData" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="分类名称" prop="typeName">
          <el-input  v-model="editFormData.typeName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addFormData" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="分类名称" prop="typeName">
          <el-input  v-model="addFormData.typeName" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
    import { blogTypeList,addBlogType, editBlogType, removeBlogType } from '../../api/api';
    export default {
        data() {
            return {
                types: [],
                total: 0,
                page: 1,
                listLoading: false,
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    typeName: [
                        { required: true, message: '请输入分类名称', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editFormData: {
                    typeName: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    typeName: [
                        { required: true, message: '请输入分类名称', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addFormData: {
                    typeName: ''
                }

            }
        },
        methods: {

            handleCurrentChange(val) {
                this.page = val;
                //this.getBlogs();
            },
            onEditorChange({ editor, html, text }) {
                console.log(text);
                this.editFormData.content = html;
                this.addFormData.content = html;
            },
            //获取分类
            getTypes() {
                let para = {
                    page: this.page
                };
                this.listLoading = true;
                //NProgress.start();
                blogTypeList(para).then((res) => {

                    this.total = res.data.count;
                    this.types = res.data.list;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //删除
            handleDel: function (index, row) {
                /*this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { id: row._id };

                    removeBlog(para).then((res) => {
                        if(res.data.code==10000){
                            this.listLoading = false;
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getBlogs();
                        }else{
                            this.listLoading = false;
                            this.$message({
                                message: '删除失败',
                                type: 'error'
                            });
                        }

                    });
                }).catch(() => {
                    this.listLoading = false;
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                });*/
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editFormData = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addFormData= {
                    typeName: ''
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editFormData);
                            editBlogType(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getTypes();
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addFormData);


                            addBlogType(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getTypes();
                            });
                        });
                    }
                });
            },

        },
        mounted() {
            this.getTypes();
        }
    }

</script>