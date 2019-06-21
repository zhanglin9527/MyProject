var express = require('express');
var router = express.Router();
//引入mysql链接
var connection  = require("./js/conn");

//使用/*设置响应头*/
router.all('*',(req,res,next)=>{
	res.setHeader("Access-Control-Allow-Origin","*")
	res.header('Access-Control-Allow-Headers', 'authorization') // 允许携带的头
	next();//放行
})

/*--- 验证token --- 开始 */ 
const expressJwt = require('express-jwt');
const secret = 'Northern_Liang';//定义签名
router.use(expressJwt ({
    secret 
}).unless({
    path: ['/login/login']  //除了这些地址，其他的URL都需要验证
}));
router.use(function (err, req, res, next) {
    //当token验证失败时会抛出如下错误
    if (err.name === 'UnauthorizedError') {   
        //这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
        res.status(401).send('invalid token...');
    }
})
/*--- 验证token -- 结束 ---*/ 

/*商品添加*/
router.post('/goodsadd',(req,res)=>{
	//接受前段的发送数据
	let {goodsGroup,UPC,name,salePrice,marketPric,purchasePrice,selectSum,weight,productUnit,vip,promotion,introduction} = req.body;
	//准备sql
	let sql = `insert into goods(goodsGroup,UPC,name,salePrice,marketPric,purchasePrice,selectSum,weight,productUnit,vip,promotion,introduction) values("${goodsGroup}","${UPC}","${name}","${salePrice}","${marketPric}","${purchasePrice}","${selectSum}","${weight}","${productUnit}","${vip}","${promotion}","${introduction}")`
	//执行sql
	connection.query(sql,(err,data)=>{
		//有错抛出错误
		if(err) throw err;
		//判断收到影响的行数
		if (data.affectedRows > 0) {
			// 响应成功的数据对象给前端
			res.send({code: 0, msg: "恭喜皇上!添加商品成功!"})
		} else {
			// 响应失败的数据对象给前端
			res.send({code: 1, msg: "启奏吾皇！添加商品失败!"})
		}
	})
})
/*商品管理页面刷新*/
router.get('/goodsmanage',(req,res)=>{
	//获取前台发送的数据
	 let { currentPage ,pageSize ,category, keyWord } = req.query
	//准备sql
	let sql  = `select * from goods where 1=1`
	// 如果分类不等于空 且 不等于全部
	if (category !== '' && category !== '全部分类') {
		// 拼接第一个查询条件
		sql += ` and goodsGroup='${category}'`;
	}
	
	// 如果第二个关键字不为空 那么就拼接sql
	if (keyWord !== '') {
		sql += ` and (name like '%${keyWord}%' or UPC like '%${keyWord}%')`
	}
	
	console.log("1111：",sql)
	//执行sql
	connection.query(sql,(err,data)=>{
		//有错抛出错误
		if(err) throw err;
		//定义total保存data的数据条数
		let total = data.length
		//定义n报存跳过多少条
		let n = (currentPage-1) * pageSize
		//拼接sql
		sql += ` limit ${n},${pageSize}`
		//执行sql
		connection.query(sql,(err,data)=>{
			//有错抛出错误
			if(err) throw  err;
			//返回数据
			res.send({total,data})
		})
	})
})
/*删除*/
router.get("/goodsdel",(req,res)=>{
	//接受前台发送的id
	let {id} = req.query;
	//准备sql
	let sql = `delete  from goods where id = "${id}"`;
	//执行sql
	connection.query(sql,(err,data)=>{
		//有错抛出错误
		if(err) throw err;
		//判断是否有数据收到影响
		if(data.affectedRows > 0){
			//响应成功的数据对象给前端
			res.send({code:0,msg:"启奏吾皇！斩杀成功！"})
		}else{
			//响应失败的数据给前端
			res.send({code:1,msg:"启奏吾皇！敌军依然撤退！"})
		}
	})
})
/* 数据回填*/
router.get("/goodsback",(req,res)=>{
	// 接受前台发送的id
	let {id} = req.query;
	// 准备sql
	let sql = `select * from goods where id ="${id}"`
	//执行sql
	connection.query(sql,(err,data)=>{
		////有错抛出错误
		if(err) throw err;
		//返回数据
		res.send(data)
	})
})
/*保存修改*/
router.post("/saveEdit",(req,res)=>{
	
	//接受前台发送数据
	let {name,vip,weight,id,promotion,selectSum} = req.body;
	//准备sql
	let sql = `update goods set name="${name}",weight="${weight}",promotion="${promotion}",selectSum="${selectSum}",vip="${vip}" where id = "${id}"`

	//执行sql
	connection.query(sql,(err,data)=>{
		//有错抛出错误
		if(err) throw err;
		//对数据库受影响的行数进行判断
		if(data.affectedRows > 0) {
			// 响应成功的数据对象给前端
			res.send({code: 0, msg: "恭喜皇上!目标修改完成!"})
		} else {
			// 响应失败的数据对象给前端
			res.send({code: 1, msg: "启奏吾皇！目标修改失败!"})
		}
	})
})
/*系统刷新*/
 router.get("/goods",(req,res)=>{
	
	//准备sql
	let sql = `select * from goods`
	
	//执行sql
	connection.query(sql,(err,data)=>{
		//有错抛出错误
		if(err) throw err;
		//给前端返回数据
		res.send(data)
	})
})
module.exports = router;