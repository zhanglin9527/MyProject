<template>
    <div class="system-info">
       <!-- 卡片组件 -->
        <el-card class="box-card" shadow="always">
            <!-- 头 -->
            <div slot="header" class="clearfix">
                <h2>系统信息</h2>
            </div>

            <!-- 身体 -->
            <div class="item">
                <!-- 提示 -->
                <el-alert
                    title="成功提示的文案"
                    type="success"
                    show-icon>
                </el-alert>
                <el-alert
                    title="消息提示的文案"
                    type="info"
                    show-icon>
                </el-alert>

                <!-- 左右表格 -->
                <el-row :gutter="30">
                    <el-col :span="12">
                        <!-- 左面板 -->
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <h3>销售排行</h3>
                            </div>
                            <div class="text item">
                                <!-- 左表格 -->
                                 <el-table
                                    :data="saleRank"
                                    style="width: 100%"
                                    >
                                    <!-- 商品名称 -->
                                    <el-table-column
                                        prop="name"
                                        label="商品名称"
                                        width="300">
                                        <template ></template>
                                    </el-table-column>

                                    <!-- 销量 -->
                                    <el-table-column
                                        prop="saleAllPrice"
                                        label="销量">
                                        <template></template>
                                    </el-table-column>

                                </el-table>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                         <!-- 右面板 -->
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <h3>缺货的商品</h3>
                            </div>
                            <div class="text item">
                                <!-- 右表格 -->
                                <el-table
                                    :model="tableData"
                                    >

                                    <!-- 商品名称 -->
                                    <el-table-column
                                        prop="goodsName"
                                        label="商品名称"
                                        >
                                        
                                    </el-table-column>

                                    <!-- 库存 -->
                                    <el-table-column
                                    prop="num"
                                    label="库存"
                                    >
                                    </el-table-column>
                                    <!-- 操作 -->
                                    <el-table-column
                                    fixed="right"
                                    label="操作"
                                    >
                                    <template >
                                        <el-button type="text" size="small">入库</el-button>
                                    </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

            </div>
        </el-card>

    </div>
</template>

<script>
import {goods} from '@/api/good'
    export default {
        created(){
            this.refresh()
        },
        data(){
            return{
                //销售排行
                saleRank:[
                    
                ],
                tableData:[
                    {
                        goodsName: '彼岸花',
                        num: 0
                    }
                ]

            }
        },
        methods:{
            refresh(){
                
                goods()
                    .then((res)=>{    
                        //定义数组保存值
                        let Data = []
                        //计算数组类的值
                        for(let i =0;i<res.length;i++){
                            //销售总价
                            let salePriceAll = res[i].salePrice * res[i].weight;
                            //综合数据
                            Data[i] = {
                                name: res[i].name,
                                saleAllPrice:salePriceAll
                            }
                        }
                      
                        Data.sort(this.sortBy("saleAllPrice"));
                        Data.reverse();
                        console.log(Data)
                        this.saleRank = Data;
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
            },
            //排序
            sortBy(field) {
                return function(a,b) {
                    return a[field] - b[field];
                }
            }
        }
    }
</script>

<style lang="less">
    .system-info {
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
    }
</style>