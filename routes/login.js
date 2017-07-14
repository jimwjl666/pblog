var express = require('express');
var db=require('../config/db');
var ObjectId = require('mongodb').ObjectId;
var router = express.Router();

/* 登录页路由. */
router.post('/', function(req, res, next) {

    var name=req.body.username,
        password=req.body.password;

    db.findOne('users', {userName: name}, function (err, response) {
        if(response){
            var user=response;
            if(user.password==password){
                //提示登录成功
                delete user.password;
                res.json({msg:'登录成功',code:10000,user:user})
            }else{
                //提示用户名或者密码错误
                res.json({msg:'用户名或密码错误',code:10001})
            }

        }else{
            res.json({msg:'用户名或密码错误',code:10001})
        }
    });

});
module.exports = router;