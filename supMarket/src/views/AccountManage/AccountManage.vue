<template>
    <div class="account-manage">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h2>账号管理</h2>
                
            </div>
            <div  class="item">
                <!-- 主题表格 -->
               <el-table
                    ref="accountTableData"
                    :data="accountTableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="selectIdChange"
                    >
                    <!-- 选择框 -->
                    <el-table-column
                    type="selection"
                    width="55"
                    >
                    </el-table-column>
                    <!-- 账号 -->
                    <el-table-column
                    prop="account"
                    label="账号"
                    >
                     <template ></template>
                    </el-table-column>
                    <!-- 邮箱 -->
                    <el-table-column
                    prop="email"
                    label="邮箱"
                    >
                     <template></template>
                    </el-table-column>
                    <!-- 用户分组 -->
                    <el-table-column
                    prop="user_group"
                    label="用户分组"
                    >
                     <template ></template>
                    </el-table-column>
                    <!-- 日期 -->
                    <el-table-column
                    prop="create_date"
                    label="日期"
                    >
                    <template slot-scope="scope">{{ scope.row.create_date |  format  }}</template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!-- 编辑按钮 -->
                            <el-button
                                size="mini"
                                type="primary"
                                @click="handleEdit(scope.row.id)"
                                >
                                <i class="el-icon-edit"></i>
                                编辑
                            </el-button> 
                            <!-- 删除按钮 -->
                            <el-button
                                size="mini"
                                type="danger"
                                prop="id"
                                @click="handleDelete(scope.row.id)"
                                >
                                    <i class="el-icon-delete"></i>
                                    删除
                                </el-button>
                        </template>
                    </el-table-column>

                </el-table>
                 <!-- 分页 -->
                <div class="paging">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[1, 3, 5, 10, 20, 50]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        
                        >
                    </el-pagination>
                </div>
                <!-- 批量删除&取消选择 -->
                 
                <div style="margin-top: 20px" >
                    <el-button type="danger" size="small" @click="delAll" >批量删除</el-button>
                    <!-- <el-button type="danger" size="small" @click="delAll" disabled v-if="b">批量删除</el-button> -->
                    <el-button type="primary" size="small" @click="select">取消选择</el-button>
                </div>
            </div>
             <!-- 修改表单模态框 -->
            <el-dialog title="修改账号" width="420px" :visible.sync="visible">
                <!-- 修改表单 -->
                <el-form ref="editForm" :model="editForm" style="width: 316px" :rules="rules">
                    <!-- 账号 -->
                    <el-form-item label="账号" prop="account" label-width="120px">
                        <el-input v-model="editForm.account" autocomplete="off"></el-input>
                    </el-form-item>
                     <!-- 邮箱 -->
                    <el-form-item label="邮箱" prop="email" label-width="120px">
                     <el-input type="text" v-model="editForm.email"></el-input>
                    </el-form-item>
                     <!-- 用户组 -->
                    <el-form-item label="用户组" label-width="120px">
                        <el-select v-model="editForm.userGroup" placeholder="请选择用户组">
                            <el-option label="超级管理员" value="超级管理员"></el-option>
                            <el-option label="普通用户" value="普通用户"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <!-- 修改表单按钮 -->
                <div slot="footer" class="dialog-footer">
                    <el-button @click="visible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import {emailReg} from '@/utils/reg';//引入工具函数
import moment from "moment";//引入moment
import { log } from 'util';
import {delAll,dataBack,SaveEdit,getDataByPage} from '@/api/account';//引入api
    export default {
        created(){
            this.refresh();
        },
        data(){
            //邮箱验证
            var checkEmail =(rule,value,callback) =>{//邮箱验证
                if(value === ''){//非空
                    callback(new Error("请输入邮箱地址"))
                }else if(!emailReg(value)){//格式验证 正则
                    callback(new Error("请输入正确的邮箱格式"))
                }else{
                    callback();
                }
            };
            return{
                //数据
                accountTableData:[
                   
                ],
                currentPage: 1,  // 当前页
                total: 13, // 数据总条数
                pageSize: 3 ,// 每页条数
                editForm:{//修改信息表单
                    account:"",//账号
                    email:"",//邮箱
                    userGroup:""//分组
                },
                visible: false, // 修改模态框的显示和隐藏状态
                rules:{//验证规则
                     //账号验证
                    account:[
                         { required: true, message: '请输入账号', trigger: 'change' }, // 非空验证
                         { min: 3 , max: 5, message:'只能写3-5个字符' , trgger : 'change'},//长度验证
                    ],
                     //邮箱验证
                    email:[
                        {required:true,validator:checkEmail,trigger:"change"}
                    ]
                },
                editId:"",//保存id
                delIdArr:[],//保存批量删除的id
                //a:false,//对按钮禁用进行判断
                //b:true,
                //btnSelection: []
            }
        },
        methods: {
            //取消选择
            select(){
                this.$refs.accountTableData.clearSelection();
            },
            //点击全选获取id
            selectIdChange(val){
                this.delIdArr = val.map( v => v.id)
                /* console.log(!this.btnSelection.length)
                if(!this.btnSelection.length){
                    this.a = !this.a
                    this.b =!this.b
                }else{
                    this.a =false,
                    this.b= true
                } */
            },
            //批量删除
            delAll(){
                // 如果没有选中 给出错误提示 结束函数
                if (!this.delIdArr.length) {
                    // 弹错误提示
                    this.$message({
                            showClose: true,
                            message: '吾皇，你操作失误了呢！',
                            type: 'error'

                    });
                    return
                }
                // 优化删除体验
                this.$confirm('你确定要批量删除吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => { // 确定
                    // 收集被选中的数据的id
                    let params = {
                    idarr : this.delIdArr
                    }
                    // 发送请求给后端 把被选中的id一起发送给后端
                    delAll(params)
                    .then(res => {
                        // 接收数据
                        let {code, msg} = res;
                        if (code === 0) {
                        // 弹成功提示
                        this.$message({
                            showClose: true,
                            type: 'success',
                            message: msg
                        })
                        // 刷新列表
                        this.refresh();
            
                        } else if (code === 1) {
                        // 弹失败提示
                        this.$message({
                                showClose: true,
                                message: msg,
                                type: 'error'
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                }).catch(() => { // 取消
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            
            // 编辑
            handleEdit(id) {
                //编辑框显示
                this.visible = true;
                // 保存id
                this.editId = id;
                //发送请求
               dataBack({id})
                .then(res =>{
                   let data = res;
                   //回填表单

                   this.editForm.account = data[0].account;//账号
                   this.editForm.email = data[0].email;//邮箱
                   this.editForm.userGroup = data[0].user_group;//分组
                })
                .catch(err=>{
                    console.log(err);
                    
                })
            },
            // 编辑提交
            saveEdit(){
                this.$refs.editForm.validate((valid)=>{
                    if(valid) {
                        // 隐藏模态框
                        this.visible = false;
                        //获取参数
                        let params ={
                            account :this.editForm.account,
                            email : this.editForm.email,
                            user_group : this.editForm.userGroup,
                            id : this.editId
                        }
                       SaveEdit(params)
                        .then(res =>{
                            let {code,msg} = res;//解构后台发送过来的数据
                            if(code === 0){
                                this.$message({
                                    showClose: true,
                                    message: msg,
                                    type: 'success'
                                    })
                                this.refresh()
                            }else if(code === 1){
                                this.$message({
                                showClose: true,
                                message: msg,
                                type: 'error'
                                });
                            }
                    })
                    .catch(err=>{
                        console.log(err); 
                    })
                    }else{
                        return false;
                    }
                })
            },
            // 删除
            handleDelete(id) {
                
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    })
                    .then(() => {
                  accountDel({id})
                .then((res)=>{
                    let {code,msg} = res;//结构后台返回的数据
                    if(code === 0){//判断响应吗
                        this.$message({
                            showClose: true,
                            message: msg,
                            type: 'success'
                        })
                        this.refresh()
                    }else if(code === 1){
                        this.$message({
                            showClose:true,
                            message:msg,
                            type:'error'
                        })
                    }
                })
                .catch((err)=>{
                    console.log(err)
                })
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '皇上圣喻：撤!'
                    });          
                });
               /*   */
            },
            // pageSize（每页条数）改变
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.refresh();
            },
            // currentPage（当前页）改变 
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.refresh();
            },
            //刷新
            /* refresh(){
                this.$req.get("http://127.0.0.1:4396/accountmanage")
                    .then((response)=>{
                        
                        this.accountTableData =  response.data;
                        // console.log(this.accountTableData);
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
            }, */
            refresh(){
                let params ={
                    currentPage : this.currentPage,
                    pageSize : this.pageSize
                } 
              getDataByPage(params)
                    .then((res)=>{
                        let {total,data} =res
                        this.total = total
                        this.accountTableData =  data;
                        if(!data.length && currentPage !== 1){
                             // 回到上一页
                            this.currentPage -= 1;
                            // 调用自己
                            this.refresh();
                        }
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
            }

        },
        filters:{
            format(ctime){
               return moment(ctime).format("YYYY/MM/DD hh:mm:ss");
            }
        }
    }
</script>

<style lang="less">
    .account-manage{
         .el-card {
            .el-card__header {
                background-color: #f1f1f1;
                font-size: 20px;
            }
            .el-card__body {
                .el-alert {
                    margin: 20px auto;
                }
            }
        }
        .item{
            .paging{
                width:570px;
                margin: 20px auto 0px;
            }
        }
    }
</style>