var express = require('express');
var router = express.Router();
var query = require('../lib/db/mysql');
var moment = require("moment");
var queryAll=require('./CropsServices');
/* GET users listing. */
router.get('/', function(req, res) {
    res.render('table',{'jsname':'crops','head':'添加农作物','name':'农作物名称','description':'描述'});
});
/**
 * 查询所有农作物
 * @param  {[type]} req  [description]
 * @param  {[type]} res) {	var        page [description]
 * @return {[type]}      [description]
 */
router.post('/query', function(req, res) {
	var page=req.body.page;
	var rows=req.body.rows;
	var start=rows*(page-1);
	var limit=rows*page;
	var filters=req.body.filters;
	var sql=queryAll(filters,start,limit);
	var total;
	var pages;
	query('select * from crops',function(err,vals,fileds){
		total=vals.length;
		pages=Math.ceil(total/rows);
		query(sql,function(err,vals,fileds){
			if(err==null){
				for (var i = 0; i < vals.length; i++) {
					vals[i].insertTime=moment(vals[i].insertTime).format('YYYY-MM-DD HH:mm:ss');
					// vals[i].updateTime=moment(vals[i].updateTime).format('YYYY-MM-DD HH:mm:ss');
				}
				res.json({'success':true,'total':total,'pages':pages,'crops':vals});
			}else{
				console.log(err);
			}
		});
	});
});
/**
 * 增加
 * @param  {[type]} req        [description]
 * @param  {[type]} res){	var name          [description]
 * @return {[type]}            [description]
 */
router.post('/add',function(req,res){
	var name=req.body.name;
	var description=req.body.description;
	var date=moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	query('insert into crops(name,description,insertTime) values ('+name+','+description+',\"'+date+'\")',function(err,vals,fileds){
		if(err){
			console.log(err);
			res.json({'success':true,'reslut':'failed'});
		}else{
			res.json({'success':true,'reslut':'ok'});
		}
	});
});
/**
 * 删除
 * @param  {[type]} req        [description]
 * @param  {[type]} res){	var id            [description]
 * @return {[type]}            [description]
 */
router.post('/delete',function(req,res){
	var id=req.body.id;
	query('delete from crops where id='+id,function(err,vals,fileds){
		if(err){
			console.log(err);
			res.json({'success':true,'result':'failed'});
		}else{
			res.json({'success':true,'result':'ok'});
		}
	});
});
/**
 * 修改
 * @param  {[type]} req        [description]
 * @param  {[type]} res){	var id            [description]
 * @return {[type]}            [description]
 */
router.post('/edit',function(req,res){
	var id=req.body.id;
	var description=req.body.description;
	query('update crops set description=\"'+description+'\" where id='+id,function(err,vals,fileds){
		if(err){
			console.log(err);
			res.json({'success':true,'result':'failed'});
		}else{
			res.json({'success':true,'result':'ok'});
		}
	});
});
/**
 * 重复添加检查
 * @param  {[type]} req         [description]
 * @param  {[type]} res         [description]
 * @param  {[type]} next){	var number        [description]
 * @return {[type]}             [description]
 */
router.post('/checkName',function(req,res){
	var name=req.body.name;
	query('select * from crops where name=\"'+name+'\"',function(err,vals,fileds){
		if(vals.length>0){
			res.json({'success':true,'result':'exist'});
		}else{
			res.json({'success':true,'result':'ok'});
		}
	});
});
router.get('/getName',function(req,res){
	query('select id,name from crops',function(err,vals,fileds){
		if(err){
			console.log(err);
			res.json({'success':true,'result':'failed'});
		}else{
			res.json({'success':true,'crops':vals});
		}
	});
})
module.exports = router;
