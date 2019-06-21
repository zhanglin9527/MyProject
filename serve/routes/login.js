var express = require('express');
var router = express.Router();
/* 引入 */
const jwt= require('jsonwebtoken');
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



//引入mysql链接
var connection  = require("./js/conn");

/*设置响应头*/
router.all('*',(req,res,next)=>{
	res.setHeader("Access-Control-Allow-Origin","*")
	res.header('Access-Control-Allow-Headers', 'authorization') // 允许携带的头
	next();//放行
})

/*登录*/
router.post("/login",(req,res)=>{
	//接受前台参数
	let {account,password,userGroup} =req.body;
	
	//创建sql语句
	let sql = `select * from accounts where account="${account}" and password="${password}" and user_group="${userGroup}"`
	//执行sql
	connection.query(sql,(err,data)=>{
		console.log('ppppp',data)
		//有错抛出错误
		if(err) throw err;
		//如果有长度 登录成功 没有则 登录失败、
		if(data.length){
			
			
			// 3. 生成token
			const token = jwt.sign(Object.assign({},  data[0]), secret, {
			    expiresIn:  60 * 60 * 2 // 过期时间
			})

			
			//给前端返回数据
			res.send({code:0,msg:"恭贺皇上！登录成功！",token})
		}else{
			//给前端返回数据
			res.send({code:1,msg:"启奏吾皇！登录失败！请检阅三军"})
		}
	})
})


module.exports = router;
