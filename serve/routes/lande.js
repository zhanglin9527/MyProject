var express = require('express');
var router = express.Router();
//引入mysql链接
var connection  = require("./js/conn");
/*设置响应头*/
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

/*刷新*/
router.get("/refresh",(req,res)=>{
	//接受前段传递的参数
	let {term} = req.query;
	//准备sql
	let sql = `select * from IandE where id < '${term}' `
	//执行sql
	connection.query(sql,(err,data)=>{
		//有错抛出错误
		if(err) throw err;
		//给前端返回数据
		res.send(data)
	})
})

module.exports = router;