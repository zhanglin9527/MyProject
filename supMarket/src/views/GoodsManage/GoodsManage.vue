<template>
    <div class="goods-manage">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h2>商品管理</h2>
            </div>
            <div  class=" item">
                <el-form 
                 :inline="true" 
                 :model="goodsAddForm" 
                 size="small"
                 >
                    <el-select 
                     v-model="goodsAddForm.category" 
                     clearable 
                     size="small"
                     style="margin-right:15px;"
                     placeholder="------选择分类------">
                        <el-option label="全部分类" value="全部分类"></el-option>
                        <el-option label="生活类" value="生活类"></el-option>
                        <el-option label="观赏类" value="观赏类"></el-option>
                        </el-select>
                    <el-form-item label="关键字:">
                    <el-input 
                     v-model="goodsAddForm.keyWord"
                     style="width:200px;"
                     >
                    </el-input>
                    <span style="color: #909399;">(商品名称，关键字)</span>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
                <div class="table-box">
                    <!-- 商品表格 -->
                    <el-table
                     tooltip-effect="dark"
                     :data="goodsTable"
                     style="width: 100%">
                        <!-- 条形码 -->
                        <el-table-column
                         prop="UPC"
                         label="商品条形码"
                         >
                             <template ></template>
                        </el-table-column>
                        <!-- 商品名称 -->
                        <el-table-column
                         prop="name"
                         label="商品名称"
                         >
                            <template ></template>
                        </el-table-column>
                        <!-- 所属分类 -->
                        <el-table-column
                         prop="goodsGroup"
                         label="所属分类"
                         >
                             <template ></template>
                        </el-table-column>
                        <!-- 售价 -->
                        <el-table-column
                         prop="salePrice"
                         label="售价(元)"
                         
                         >
                             <template ></template>
                        </el-table-column>
                        <!-- 促销 -->
                        <el-table-column
                         prop="promPrice"
                         label="促销价(元)"
                         >
                             <template ></template>
                        </el-table-column>
                        <!-- 市场价 -->
                        <el-table-column
                         prop="marketPrice"
                         label="市场价(元)"
                         >
                             <template ></template>
                        </el-table-column>
                        <!-- 库存 -->
                        <el-table-column
                         prop="selectSum"
                         label="库存"
                         >
                             <template ></template>
                        </el-table-column>
                        <!-- 库存总额 -->
                        <el-table-column
                         prop="selectSumPrice"
                         label="库存总额(元)"
                         >
                             <template ></template>
                        </el-table-column>
                        <!-- 销售总额 -->
                        <el-table-column
                         prop="saleAllPrice"
                         label="销售总额(元)"
                         >
                             <template ></template>
                        </el-table-column>
                        <!-- 管理 -->
                        <el-table-column 
                         label="管理"
                         >
                          <template slot-scope="scope">
                            <i class="el-icon-edit"  @click="handleEdit(scope.row.id)"></i> 
                            <i class="el-icon-delete " style="margin-left:15px;"  @click="handleDelete(scope.row.id)"></i>
                          </template>
                        </el-table-column>
                    </el-table>
                </div>
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
            </div>
        </el-card>
             <!-- 修改表单模态框 -->
            <el-dialog title="商品管理" width="420px" :visible.sync="visible">
                <!-- 修改表单 -->
                <el-form ref="editForm" :model="editForm" style="width: 316px" >
                    <!-- 商品名称 -->
                    <el-form-item label="商品名称" prop="name"  label-width="120px">
                        <el-input type="text" v-model="editForm.name" autocomplete="off" disabled></el-input>
                    </el-form-item>
                     <!-- 商品销量 -->
                    <el-form-item label="商品销量" prop="weight" label-width="120px">
                        <el-input type="text" v-model="editForm.weight" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 入库数量 -->
                    <el-form-item label="入库数量" prop="selectSum" label-width="120px">
                        <el-input type="text" v-model="editForm.selectSum" autocomplete="off" ></el-input>
                        
                    </el-form-item>
                      <!-- 会员优惠 -->
                    <el-form-item label="会员优惠" prop="vip" label-width="120px">
                        <el-radio-group v-model="editForm.vip">
                        <el-radio label="享受"></el-radio>
                        <el-radio label="不享受"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 是否促销 -->
                    <el-form-item label="是否促销" prop="promotion" label-width="120px">
                        <el-radio-group v-model="editForm.promotion">
                        <el-radio label="启用"></el-radio>
                        <el-radio label="禁用"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <!-- 修改表单按钮 -->
                <div slot="footer" class="dialog-footer">
                    <el-button @click="visible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </div>
            </el-dialog>
    </div>
</template>

<script>
import { log } from 'util';
import {goodsMan,goodsDel,goodsBack,saveEdit} from '@/api/good'
    export default {
        created(){
            this.refresh();
        },
        data() {
            return {
                goodsAddForm:{
                    category: '',//选择分类
                    keyWord:"",//搜索框
                },
                editForm:{//修改信息表单
                    name:"",//名称
                    weight:"",//销量
                    selectSum:"",//入库数量
                    vip:"",//是否享受会员
                    promotion:''//是否促销
                },
                visible: false, // 修改模态框的显示和隐藏状态
                goodsTable: [//表格数据
                   
                ],
                currentPage: 1,  // 当前页
                total: 13, // 数据总条数
                pageSize: 3, // 每页条数
                id:"",//保存id
            
            }
        },
        methods:{
            //查询
            onSubmit(){
                this.refresh();
                // console.log(  this.goodsAddForm.category, 
                //     this.goodsAddForm.keyWord )
            },
             // 编辑
            handleEdit(id) {
                //编辑框显示
                this.visible = true;
                // 保存id
                this.id = id;
                //发送请求
               goodsBack({id})
                .then(res =>{
                   let data = res;
                   //回填表单

                   this.editForm.name = data[0].name;//名称
                   this.editForm.weight = data[0].weight;//销量
                   this.editForm.vip = data[0].vip;//vip
                   this.editForm.promotion = data[0].promotion;//促销
                    this.editForm.selectSum = data[0].selectSum;//入库数量
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
                            name : this.editForm.name,//名称
                            weight :this.editForm.weight,//销量
                            vip : this.editForm.vip,//vip
                            promotion : this.editForm.promotion,//促销
                            selectSum  :  this.editForm.selectSum,//入库数量
                            id : this.id//id
                        }
                       saveEdit(params)
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
                        goodsDel({id})
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
            //刷新页面
            refresh(){
                let params ={
                    currentPage : this.currentPage,
                    pageSize : this.pageSize,
                    category: this.goodsAddForm.category, // 查询分类
                    keyWord: this.goodsAddForm.keyWord // 查询关键字
                } 
                goodsMan(params)
                    .then((res)=>{
                        let {total,data} =res 
                        this.total = total
                        //定义数组保存值
                        let tableData = []
                        //计算数组类的值
                        for(let i =0;i<data.length;i++){
                            
                            //判断是否促销
                            let prom;
                            if(data[i].promotion === "启用" ){
                                prom = data[i].salePrice * 0.9
                            }else if(data[i].promotion === "禁用"){
                                prom = data[i].salePrice
                            }
                            //库存
                            let num = data[i].selectSum - data[i].weight
                            //库存总价
                            let numPrice = num * data[i].salePrice
                            //销售总价
                            let salePriceAll = data[i].salePrice * data[i].weight;
                            //综合数据
                            
                            tableData[i] = {
                                id : data[i].id,
                                UPC: data[i].UPC,
                                name: data[i].name,
                                goodsGroup: data[i].goodsGroup,
                                salePrice:data[i].salePrice,
                                promPrice: prom,
                                marketPrice:data[i].marketPric,
                                selectSum:num,
                                selectSumPrice:numPrice,
                                saleAllPrice:salePriceAll
                            }
                        }
                        //渲染页面
                        this.goodsTable = tableData;
                        if(!tableData.length && currentPage !== 1){
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
        }
    }
</script>

<style lang="less">
    .goods-manage{
         .el-card {
            .el-card__header {
                background-color: #f1f1f1;
                font-size: 20px;
            }
            .el-card__body {
                .el-alert {
                    margin: 20px auto;
                  
                }
                .paging{
                width:570px;
                margin: 20px auto 0px;
            }
            }
            .table-box{
                border-top: 2px solid #ddd;
                i{
                    cursor: pointer;
                    color:rgb(29, 139, 248);
                    font-size: 20px;
                    &:hover{
                        color: #031a33;
                    }
                }
                
            }
        }
    }
</style>