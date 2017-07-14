var qiniu=require('qiniu');

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = '';
qiniu.conf.SECRET_KEY = '';
//要上传的空间
var bucket = 'wjlqiniu';
//上传到七牛后保存的文件名


function uptoken(bucket, key) {
    console.log('key',key);
    var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
    return putPolicy.token();
}
//生成上传 Toke

var upload={
    getToken:function () {
        var key=(new Date()).getTime();
        return {token:uptoken(bucket, key),key:key};
    }
}
module.exports=upload;