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

/*添加账号*/
router.post("/accountadd",(req,res)=>{
	//接受前台参数
	let  {account,password,email,userGroup} = req.body;
	//创建sql语句
	let sql = `insert into accounts(account,password,email,user_group) values("${account}","${password}","${email}","${userGroup}")`
	//执行sql
	connection.query(sql,(err,data)=>{
		//有错抛出错误
		if(err) throw err;
		// 如果受影响行数大于0 代表成功 否则代表失败
		if (data.affectedRows > 0) {
			// 响应成功的数据对象给前端
			res.send({code: 0, msg: "恭喜皇上!添加账号成功!"})
		} else {
			// 响应失败的数据对象给前端
			res.send({code: 1, msg: "启奏吾皇！添加账号失败!"})
		}
	})
	
})
/*获取表*/
/* router.get("/accountmanage",(req,res)=>{
	//准备sql
	let sql = `select * from accounts order by create_date desc`
	//执行sql
	connection.query(sql,(err,data)=>{
		//有错抛出错误
		if(err) throw err;
		//给前端返回数据
		res.send(data)
	})
}) */
router.get("/accountmanagebypage",(req,res)=>{
	//获取前台发送的数据
	let {currentPage,pageSize} = req.query;
	//准备sql
	let sql  = `select * from accounts order by create_date desc`
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
router.get("/accountdel",(req,res)=>{
	//接受前台发送的id 
	let {id} = req.query;
	//准备sql
	let sql = `delete  from accounts where id = "${id}"`;
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
router.get("/dataBack",(req,res)=>{
	// 接受前台发送的id
	let {id} = req.query;
	// 准备sql
	let sql = `select * from accounts where id ="${id}"`
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
	let {account,email,user_group,id} = req.body;
	//准备sql
	let sql = `update accounts set account="${account}",email="${email}",user_group="${user_group}" where id = "${id}"`

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
/*删除全部*/
router.get("/delAll",(req,res)=>{
	//接受前台发送的数据
	let { idarr } = req.query;
	//准备sql
	let sql = `delete from accounts where id  in (${idarr})`
	//执行sql
	connection.query(sql,(err,data)=>{
		//如果有错抛出错误
		if(err) throw err;
		//判断是否有一行数据收到影响
		if(data.affectedRows > 0){//收到影响
			res.send({code:0,msg:"启奏吾皇！敌军已全部斩杀！"})
		}else{//未受到影响
			res.send({code:1,msg:"启奏吾皇！敌军反抗激烈，请求支援！"})
			
		}
	})
})
/* 用户信息 */ 
router.get('/info', (req, res) => {
	// 获取id
	let id = req.user.id;
	
	// 构造sql
	const sqlStr = `select * from accounts where id=${id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		res.send({ data })
	})
})
/* 验证旧密码是否正确 */ 
router.post('/checkoldpass', (req, res) => {
	// 接收旧密码
	let { oldPwd } = req.body;

	// 验证是否正确
	if (oldPwd === req.user.password) {
		res.send({code: 0, reason: '原密码正确'})
	} else {
		res.send({code: 1, reason: '旧密码错误'})
	}
})

/* 修改密码 */ 
router.post('/passwordmodify', (req, res) => {
	// 接收新密码
	let {newPassword} = req.body;
	// 取出id
	let id = req.user.id;

	// 构造sql
	const sqlStr = `update accounts set password='${newPassword}' where id= '${id}'`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: '密码修改成功！请重新登录!'})
		} else {
			res.send({code: 1, reason: '密码修改失败！哈哈!'})
		}
	})
})

/* -----上传开始---- */ 
// 引入node上传模块
var multer = require('multer');

// 配置存储路径 和 重命名
var storage = multer.diskStorage({
    // 图片上传到服务器以后 要放置的路径
    destination: 'public/upload',

    // 图片重命名
    filename: function (req, file, cb) {
        var fileFormat =(file.originalname).split(".");
        // 获取时间戳
        var filename = new Date().getTime();  
        // 124354654 + "." + jpg
        cb(null, filename + "." + fileFormat[fileFormat.length - 1]);
    }
});

// 上传对象
var upload = multer({
    storage,
});

// 接收上传请求
router.post('/uploadavatar', upload.single('file'), (req, res) => {
    // 接收到的文件信息
	var file = req.file;
	console.log(file)

	// 文件名
	let fileName = file.filename;
	// 拼接文件路径
	let avatarUrl = '/upload/' + fileName

	// 构造sql
	const sqlStr = `update accounts set avatarUrl = '${avatarUrl}' where id=${req.user.id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: "上传成功", avatarUrl})
		} else {
			res.send({code: 1, reason: "上传失败"})
		}
	})
})

/* ----上传结束----- */ 

/* 获取用户角色 */ 
router.get('/role', (req, res) => {
	res.send({role: req.user.user_group})
})

module.exports = router;
