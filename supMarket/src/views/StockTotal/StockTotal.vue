<template>
    <div class="stock-total">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h1>进货数据统计</h1>
            </div>
            <div class="item">
                <span>时间:</span>
                <el-date-picker
                    v-model="value2"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="margin-left:5px;"
                    :picker-options="pickerOptions">
                </el-date-picker>
                <el-button type="primary"  style="margin-left:20px;">查询</el-button>
                <div id="myChart" style="width:800px; height: 400px;margin:30px auto 0px;"></div>
            </div>
        </el-card>
    </div>
</template>

<script>
import {refresh} from "@/api/LandE"//引入刷新api

    export default {
        data() {
            return {
                pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
                },
                value1: '',
                value2: ''
            }
        },
        mounted() {
            this.SetEchart();
        },
        methods:{
            SetEchart(){
                let term = 8
                refresh({term})
                    .then(res =>{
                        
                       
                    
                        let xdata = res.map(v => v.time.substring(0,10));
                        let sdata = res.map(v => v.purchase);
                        // 基于准备好的dom，初始化echarts实例
                        let myChart = this.$echarts.init(document.getElementById('myChart'))
                        // 绘制图表
                        var option = {
                            title: {
                                text: '进货统计',    
                                x: 'center',
                                align: 'right'
                            },
                            xAxis: {
                                type: 'category',
                                data: xdata
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [{
                                data: sdata,
                                type: 'line'
                            }]
                        }
                        myChart.setOption(option);
                    })
                    .catch(err =>{
                        console.log(err);
                        
                    })
                
            }
        }
       
    }
</script>

<style lang="less">
    .stock-total{
        .el-card {
            .el-card__header {
                background-color: #f1f1f1;
                font-size: 20px;
            }
            .el-card__body {
                .el-alert {
                    margin: 20px auto;
                }
                #chart1 {
                    width: 800px;
                    height: 400px;
                }
            }
        }
    }
</style>