<template>
    <div class="goods-add">
       <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h2>商品添加</h2>
            </div>
            <div  class=" item">
               
               <el-form 
                    style="width: 316px"
                    size="small"
                    :model="goodsForm"
                    status-icon 
                    :rules="rules"
                    ref="goodsForm"
                    label-width="100px">
                  <!-- 商品分类 -->
                    <el-form-item label="商品分类" prop="goodsGroup">
                        <el-select v-model="goodsForm.goodsGroup" placeholder="请选择分类">
                        <el-option label="生活类" value="生活类"></el-option>
                        <el-option label="观赏类" value="观赏类"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 商品条形码 -->
                    <el-form-item label="商品条形码" prop="UPC">
                        <el-input type="text" v-model="goodsForm.UPC" autocomplete="off" style="width:100px;"></el-input>
                        <el-button type="primary" plain style="margin-left:10px;" @click="generatedBbarcode">生成条形码</el-button>
                    </el-form-item>
                    <!-- 商品名称 -->
                    <el-form-item label="商品名称" prop="name">
                        <el-input type="text" v-model="goodsForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                     <!-- 商品进价 -->
                    <el-form-item label="商品进价" prop="purchasePrice">
                        <el-input type="text" v-model="goodsForm.purchasePrice" autocomplete="off" @blur="poly" style="width:190px;margin-right:10px;"></el-input>
                        <span>元</span>
                    </el-form-item>
                    <!-- 商品售价 -->
                    <el-form-item label="商品售价" prop="salePrice">
                        <el-input type="text" v-model="goodsForm.salePrice" autocomplete="off"  style="width:190px;margin-right:10px;" ></el-input>
                        <span>元</span>
                        <div class="sub-title">默认售价是进价的1.5倍</div>
                    </el-form-item>
                    <!-- 市场价 -->
                    <el-form-item label="市场价" prop="marketPrice">
                        <el-input type="text" v-model="goodsForm.marketPrice" autocomplete="off" style="width:190px;margin-right:10px;"></el-input>
                        <span>元</span>
                        <div class="sub-title">默认市场价是售价的2倍</div>
                    </el-form-item>
                   
                    <!-- 入库数量 -->
                    <el-form-item label="入库数量" prop="selectSum">
                        <el-input type="text" v-model="goodsForm.selectSum" autocomplete="off" ></el-input>
                        <div class="sub-title">计重商品单位为千克</div>
                    </el-form-item>
                    <!-- 商品销量 -->
                    <el-form-item label="商品销量" prop="weight">
                        <el-input type="text" v-model="goodsForm.weight" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 商品单位 -->
                    <el-form-item label="商品单位" prop="productUnit">
                        <el-input type="text" v-model="goodsForm.productUnit" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 会员优惠 -->
                    <el-form-item label="会员优惠" prop="vip">
                        <el-radio-group v-model="goodsForm.vip">
                        <el-radio label="享受"></el-radio>
                        <el-radio label="不享受"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 是否促销 -->
                    <el-form-item label="是否促销" prop="promotion">
                        <el-radio-group v-model="goodsForm.promotion">
                        <el-radio label="启用"></el-radio>
                        <el-radio label="禁用"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 商品简介 -->
                    <el-form-item label="商品简介" prop="introduction">
                        <el-input type="textarea" v-model="goodsForm.introduction"></el-input>
                        <div class="sub-title">不超过200个汉字</div>
                    </el-form-item>
                    <!-- 提交按钮 -->
                    <el-form-item>
                        <el-button type="primary" @click="submitForm">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
 import {goodsAdd} from '@/api/good'//引入商品提交api
    export default {
        data(){
            return{
                goodsForm:{
                    goodsGroup:"",//商品分类
                    UPC:"",//条形码
                    name:"",//商品名称
                    salePrice:"",//商品售价
                    marketPrice:"",//市场价
                    purchasePrice:"",//商品进价
                    selectSum:"",//入库数量
                    weight:"",//商品重量
                    productUnit:"",//商品单位
                    vip:"",//是否vip
                    promotion:"",//是否促销
                    introduction:""//商品简介
                },
                rules:{
                    //商品分类
                    goodsGroup:[
                        { required: true, message: '请选择分类', trigger: 'change' }, // 非空验证
                     ],
                    //条形码
                    UPC:[
                          { required: true, message: '此处不能为空', trigger: 'blur' }, // 非空验证
                     ],
                    //商品名称
                    name:[
                          { required: true, message: '此处不能为空', trigger: 'blur' }, // 非空验证
                     ],
                    //商品售价
                    salePrice:[
                          { required: true, message: '此处不能为空', trigger: 'blur' }, // 非空验证
                     ],
                    //市场价
                    marketPrice:[
                          { required: true, message: '此处不能为空', trigger: 'blur' }, // 非空验证
                     ],
                    //商品进价
                    purchasePrice:[
                          { required: true, message: '此处不能为空', trigger: 'blur' }, // 非空验证
                     ],
                    //入库数量
                    selectSum:[
                          { required: true, message: '此处不能为空', trigger: 'blur' }, // 非空验证
                     ],
                    //商品重量
                    weight:[
                          { required: true, message: '此处不能为空', trigger: 'blur' }, // 非空验证
                     ],
                    //商品单位
                    productUnit:[
                          { required: true, message: '此处不能为空', trigger: 'blur' }, // 非空验证
                     ],
                    //是否vip
                    vip:[
                        { required: true, message: '请选择是否享受vip服务', trigger: 'change' } // 非空验证
                    ],
                    //是否促销
                    promotion:[
                         { required: true, message: '请选择是否促销', trigger: 'change' }, // 非空验证
                    ],
                    //商品简介
                    introduction:[
                         { required: true, message: '简介不能为空', trigger: 'blur' }, // 非空验证
                         { min: 10, max: 200, message: '最多输入200个汉字', trigger: 'blur' }//长度验证
                    ]
                }
            }
        },
        methods:{
            //生成条形码
            generatedBbarcode(){
                var str = "";
                for(let i=0;i<=6;i++){
                    var num = Math.floor(Math.random()*10);
                    str += num
                }
                this.goodsForm.UPC =str
            },
            //售价是进价的1.5倍,市场价是售价的2倍
            poly(){
                this.goodsForm.salePrice = (parseFloat(this.goodsForm.purchasePrice )* 1.5).toFixed(2)
                
                this.goodsForm.marketPrice = (parseFloat(this.goodsForm.salePrice) * 2).toFixed(2)
            },
            // 添加商品
            submitForm() {
                // 获取el-form组件 调用验证方法
                this.$refs.goodsForm.validate((valid) => {
                    if (valid) {//前段验证通过
                          let params ={ //获取参数
                            goodsGroup: this.goodsForm.goodsGroup,//商品分类
                            UPC: this.goodsForm.UPC,//条形码
                            name :this.goodsForm.name,//商品名称
                            salePrice: this.goodsForm.salePrice,//商品售价
                            marketPric: this.goodsForm.marketPrice,//市场价
                            purchasePrice: this.goodsForm.purchasePrice,//商品进价
                            selectSum: this.goodsForm.selectSum,//入库数量
                            weight: this.goodsForm.weight,//商品重量
                            productUnit: this.goodsForm.productUnit,//商品单位
                            vip: this.goodsForm.vip,//是否vip
                            promotion: this.goodsForm.promotion,//是否促销
                            introduction: this.goodsForm.introduction//商品简介
                        }
                       goodsAdd(params)
                        .then(res =>{
                          let {code,msg} = res;
                                if(code === 0){
                                     this.$message({
                                        showClose: true,
                                        message: msg,
                                        type: 'success'
                                        })
                                        this.$router.push("/home/goodsmanage")
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
                        
                       
                    } else {
                        console.log('前端验证不通过!')
                        return false;
                    }
                })
            }
        }
    }
</script>

<style lang="less">
    .goods-add{
         .el-card {
            .el-card__header {
                background-color: #f1f1f1;
                font-size: 20px;
            }
            .el-card__body {
                .el-alert {
                    margin: 20px auto;
                }
                .sub-title{
                    color: #909399;
                }
            }
        }
    }
</style>