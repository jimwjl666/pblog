var express = require('express');
var db=require('../config/db');
var ObjectId = require('mongodb').ObjectId;
var router = express.Router();

router.post('/list', function(req, res, next) {
    var requestObj = req.body;
    var page=requestObj.page;

    var queryObj={};
    var blogTypes= db.findAndPage('blogTypes',queryObj,{pageSize:100,pageIndex:page});
    var count= db.count('blogTypes');
   /* Promise.all([blogTypes,count]).then(function (re) {
        console.log(re);
        res.json({msg:'获取数据成功',code:10000,list:re[0],count:re[1]})
    },function(err){
        res.json({msg:'获取数据失败',code:10001})
    })*/
    db.find('blogTypes',function (err,result) {
        var list=JSON.parse(JSON.stringify(result));
        var newList=[];
        list.forEach(function (item,index) {

           var re=db.count('blogs',{typeId:item._id});
           re.then(function(count){
              item.count=count;
               newList.push(item);
               if(index==list.length-1){
                   res.json({msg:'获取数据成功',code:10000,list:newList})
               }

           }).then(function (err) {
               //console.log(err);
           })
        })

    })
})

router.post('/add', function(req, res, next) {
    var requestObj=req.body;

    db.save('blogTypes',requestObj,function (err,result) {
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

    db.update('blogTypes',{'_id':ObjectId(id)},fileds,function (err,result) {
        if(err){
            //返回错误信息
            res.json({msg:err,code:10001})
        }
        res.json({msg:'编辑数据成功！',code:10000,result:result})
    })
});

//删除分类
router.post('/delete',function (req,res,next) {
    var id=req.body.id;
    db.remove('blogTypes',{'_id':ObjectId(id)},function (err,result) {
        if(err){
            //返回错误信息
            res.json({msg:err,code:10001})
        }
        res.json({msg:'删除数据成功！',code:10000})
    })
});



module.exports = router;