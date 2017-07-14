var express = require('express');
var db=require('../config/db');
var ObjectId = require('mongodb').ObjectId;
var router = express.Router();
var timeToDate=function (time) {
    var date=new Date();
    var result= date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) ;
    return result;
};
var upload=require('../config/upload');
router.post('/list', function(req, res, next) {

    var requestObj = req.body;
    var page=requestObj.page;
    var title=requestObj.name;
    var typeId=requestObj.typeId;
    var queryObj={};
    var queryCondition={};
    if(title){
        queryObj.title={$regex:title,$options:'i'};
    }
    if(typeId){
        queryObj.typeId=typeId;
    }
    var queryCondition={};
    if(queryObj.simple){
        queryCondition=Object.assign(queryCondition,{'content':0});
    }

    var promise= db.findAndPage('blogs',queryObj,{pageSize:20,pageIndex:page},{createTime:-1});
    var count= db.count('blogs',queryObj);
    var blogTypes=db.findAndPage('blogTypes',{},{pageSize:100,pageIndex:1})
    Promise.all([promise,count,blogTypes]).then(function (re) {
        res.json({msg:'获取数据成功',code:10000,blogs:re[0],count:re[1],blogTypes:re[2]})
    },function(err){
        res.json({msg:'获取数据失败',code:10001})
    })
})

router.post('/add', function(req, res, next) {
    var requestObj=req.body;
    if(!requestObj.createTime){
        var time=(new Date()).getTime();
        var date=timeToDate(time);
        requestObj.createTime=date;
    }
    db.save('blogs',requestObj,function (err,result) {
        if(err){
            //返回错误信息
            res.json({msg:err,code:10001})
        }
        res.json({msg:'添加数据成功！',code:10000})
    })

});


router.post('/edit', function(req, res, next) {
    var requestObj=req.body;
    var fileds=requestObj;
    var id=requestObj._id;
    delete fileds._id;
    delete fileds.__v;

    db.update('blogs',{'_id':ObjectId(id)},fileds,function (err,result) {
        if(err){
            //返回错误信息
            res.json({msg:err,code:10001})
        }
        res.json({msg:'编辑数据成功！',code:10000,result:result})
    })
});

//删除博客
router.post('/delete',function (req,res,next) {
    var id=req.body.id;
    db.remove('blogs',{'_id':ObjectId(id)},function (err,result) {
        if(err){
            //返回错误信息
            res.json({msg:err,code:10001})
        }
        res.json({msg:'删除数据成功！',code:10000})
    })
});


router.post('/getToken',function (req,res,next) {
    var obj=upload.getToken();

    res.json({code:10000,data:obj});
})

module.exports = router;