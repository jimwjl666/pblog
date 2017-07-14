var express = require('express');
var router = express.Router();
var db=require('../config/db');
var ObjectId = require('mongodb').ObjectId;

/* GET home page. */
router.get('/', function(req, res, next) {
    var  renderData={title: '我的博客'}
  //获取博客分类
    var blogTypes=db.findAndPage('blogTypes');

  //获取热点新闻

    var blogs=db.findAndPage('blogs',{isTop:1});

    Promise.all([blogTypes,blogs]).then(function (re) {
        renderData={blogs:re[1],blogTypes:re[0],title:'伍姣龙的博客'};
        res.render('index', renderData);
    },function(err){
        res.render('index', renderData);
    })



});
router.get('/contact', function(req, res, next) {
    const renderData={title: '联系方式'}
    res.render('contact',renderData);
});
router.get('/detail', function(req, res, next) {
    var id=req.query.id;

    db.updateData('blogs',{'_id':ObjectId(id)},{$inc:{readerNum:1}},function (err,data) {
        console.log(data);
        if(!err){
            res.render('detail', data);
        }
    })
});

router.get('/self', function(req, res, next) {
    const renderData={title: '个人简历'}
    res.render('self', renderData);
});

module.exports = router;
