const mysql = require('mysql')

// 数据库配置
const sql = {
  database: 'test', //数据库名称
  user: 'root', //mysql用户名
  password: '123456', //mysql密码
  host: '127.0.0.1', //服务器ip
  multipleStatements: true
}

// 建立连接的方法
function _connection(){
	const connection = mysql.createConnection(sql)
	connection.connect()
	return connection
}

// 生成对数据库进行查询的操作语句
/* exports.select = function (target,table,condition,isAnd = true){
	if(typeof(condition) !== 'String'){
		let 
	}
	return `select ${target.join(',')} from ${table} where `
} */

// 对数据库进行操作
const query = (sql) => {
	// 1.获取数据库连接对象
	const connection = _connection()
	return new Promise(function(resolve,reject){
		// 2. 执行sql语句
		connection.query(sql,function(err,result,fields){
			console.log('错误：', err)
			if(err) reject(err)
			resolve(result)
		})
		// 3. 关闭链接
		connection.end()
	})
}

//  对数据库进行插入操作
const insert = async (data,table) => {
	const keys = Object.keys(data)
	const values = Object.values(data).map(item => `"${item}"`)
	const str = `insert into ${table}(${keys.join(',')}) values(${values.join(',')})`
	let flag = ''
	await query(str).then(res => flag = true).catch(err => flag = false)
	return flag
}

// 查询某个表中是否存在某条数据
const isExist = async (params,table,condition) => {
	const result = await query(`select ${condition} from ${table} where ${condition}="${params[condition]}"`)
	return result.length === 0
}

// 对数据库进行分页查询
// 参数： 需要用到的参数， 表格， 条件， 倒序的条件， 页码， 每页的显示数量
const getPageDate = async (params, table, condition, reverse, page, pageSize) => {
  const start = (page - 1) * pageSize
  const sql = `SELECT COUNT(*) FROM ${table} WHERE ${condition}="${params[condition]}" ORDER BY ${reverse} DESC; SELECT * FROM ${table} WHERE ${condition}="${params[condition]}" ORDER BY ${reverse} DESC limit ${start},${pageSize}`
  const result = await query(sql)
  return {
  	total: result[0][0]['COUNT(*)'],
  	data: result[1]
  }
}

module.exports = {
	query,
	isExist,
	insert,
	getPageDate
}