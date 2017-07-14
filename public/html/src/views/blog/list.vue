<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item lable="标题">
					<el-input v-model="filters.name" placeholder="标题"></el-input>
				</el-form-item>
				<el-form-item label="分类">
					<el-select v-model="filters.typeId" placeholder="请选择分类">
						<el-option v-for="item in blogTypes" :key="item._id" :label="item.typeName" :value="item._id" ></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getBlogs">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="blogs" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">

			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="title" label="标题" width="200" sortable>
			</el-table-column>

			<!--<el-table-column prop="introduction" label="introduction" width="100" :formatter="formatSex" sortable>
			</el-table-column>-->
			<el-table-column prop="introduction" label="简介" width="245" sortable>
			</el-table-column>
			<el-table-column prop="isTop" label="是否置顶" width="200" sortable :formatter="formatIsTop">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="200" sortable>
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editFormData" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题" prop="title">
					<el-input  v-model="editFormData.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="简介" prop="introduction">
					<el-input type="textarea" v-model="editFormData.introduction"></el-input>
				</el-form-item>
				<el-form-item label="分类">
					<el-select v-model="typeId" placeholder="请选择分类" @change="changeSelValue">
						<el-option v-for="item in blogTypes" :key="item._id" :label="item.typeName" :value="item._id" ></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="内容详情" prop="content">
					<!--<quill-editor v-model="editFormData.content"  :options="editorOption" @change="onEditorChange($event)" height="300px">
					</quill-editor>-->
					<quilleditor  v-model="editFormData.content">

					</quilleditor>
				</el-form-item>

				<el-form-item label="置顶">
					<el-radio-group v-model="editFormData.isTop">
						<el-radio class="radio" :label="0">否</el-radio>
						<el-radio class="radio" :label="1">是</el-radio>
					</el-radio-group>
				</el-form-item>
				<!--	<el-form-item label="年龄">
                        <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
                    </el-form-item>-->
				<el-form-item label="创建日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="editFormData.createTime"></el-date-picker>
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
				<el-form-item label="标题" prop="title">
					<el-input  v-model="addFormData.title" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="简介" prop="introduction">
					<el-input type="textarea" v-model="addFormData.introduction"></el-input>
				</el-form-item>

				<el-form-item label="分类">
					<el-select v-model="typeId" placeholder="请选择分类" @change="changeSelValue">
						<el-option v-for="item in blogTypes"  :key="item._id" :label="item.typeName" :value="item._id" ></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="内容详情" prop="content">
					<!--<quill-editor v-model="addFormData.content"  :options="editorOption" @change="onEditorChange($event)" height="300px">

					</quill-editor>-->
					<quilleditor  v-model="addFormData.content">

					</quilleditor>
				</el-form-item>

				<el-form-item label="置顶">
					<el-radio-group v-model="addFormData.isTop">
						<el-radio class="radio" :label="0">否</el-radio>
						<el-radio class="radio" :label="1">是</el-radio>
					</el-radio-group>
				</el-form-item>
			<!--	<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>-->
				<el-form-item label="创建日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="addFormData.createTime"></el-date-picker>
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
	import util from '../../common/js/util'
    //import NProgress from 'nprogress'
	import { getUserListPage,getBlogListPage, removeBlog, editBlog, AddBlog } from '../../api/api';
	import  quilleditor  from '../../components/Editor'
	export default {
	    components:{
            quilleditor
		},
		data() {
			return {
				filters: {
					name: '',
					typeId:''
				},
				blogs: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ],
                    introduction:[{
                        required : true,message:'请输入简介',trigger:'blur'
                    }],
                    content:[{
                        required : true,message:'请输入内容详情',trigger:'blur'
                    }]
				},
				blogTypes:[],
				//编辑界面数据
				editFormData: {
                    title: '',
                    introduction: '',
                    content: '',
                    createTime: '',
                    author: 'wjl',
                    isTop:0,
					typeId:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入标题', trigger: 'blur' }
					],
                    introduction:[{
					    required : true,message:'请输入简介',trigger:'blur'
					}],
                    content:[{
                        required : true,message:'请输入内容详情',trigger:'blur'
                    }]
				},
				//新增界面数据
                addFormData: {
                    title: '',
                    introduction: '',
                    content: '',
                    createTime: '',
                    author: 'wjl',
                    isTop:0,
					typeId:''
				},
				typeId:'',
                editorOption: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'font': [] }],
                            [{ 'align': [] }],
                            ['link', 'image'],
                            ['clean']
                        ],
                        history: {
                            delay: 1000,
                            maxStack: 50,
                            userOnly: false
                        }
                    }
                }

			}
		},
		methods: {
			//是否置顶显示转换
			formatIsTop: function (row, column) {
				return row.isTop==1?'是':'否';
			},

            changeSelValue(value){
                this.addFormData.typeId=value;
                this.editFormData.typeId=value;
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getBlogs();
			},
            onEditorChange({ editor, html, text }) {
                this.editFormData.content = html;
                this.addFormData.content = html;
            },
			//获取用户列表
			getBlogs() {
				let para = {
					page: this.page,
					name: this.filters.name,
					typeId:this.filters.typeId
				};
				this.listLoading = true;
				//NProgress.start();
                getBlogListPage(para).then((res) => {

					this.total = res.data.count;
					this.blogs = res.data.blogs;
					this.blogTypes=res.data.blogTypes;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
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
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				row.isTop=parseInt(row.isTop);
				this.editFormData = Object.assign({}, row);
                this.typeId=this.editFormData.typeId;
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addFormData= {
					title: '',
                    introduction: '',
                    content: '',
                    createTime: '',
					author: 'wjl',
					isTop:0,
					typeId:''
				};
				this.typeId='';

			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editFormData);
						    para.createTime = (!para.createTime || para.createTime == '') ? '' : util.formatDate.format(new Date(para.createTime), 'yyyy-MM-dd');
							editBlog(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getBlogs();
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
							para.createTime = (!para.createTime || para.createTime == '') ? '' : util.formatDate.format(new Date(para.createTime), 'yyyy-MM-dd');

                            AddBlog(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getBlogs();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//todo  批量删除
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
						this.getBlogs();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getBlogs();
		}
	}

</script>

<style>
	.ql-container{
		height:300px;
	}

</style>