/**
 * Created by Administrator on 2017/10/20.
 * 用户模式定义
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');/*加密*/
var SALT_WORK_FACTOR = 0;
var UserSchema = new mongoose.Schema({
   name:{
       type:String,
       unique:true
   },
    password:String,
    /*用户角色
    0:normal user
    1:verified user
    2:professional user
    >10:admin
    >50:kaifang
    * */
    role:{
       type: Number,
        default:0
    },
    meta:{
        creatAt:{
            type:Date,
            default:Date.now()
        },
        updateAt: {
            type:Date,
            default:Date.now()
        }
    }

});

UserSchema.pre('save',function (next) {
    var user = this;
    if(this.isNew) {
        this.meta.creatAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    /*为密码加盐
    * argument1:计算强度
    * argument2:回调函数
    * */
    bcrypt.genSalt(SALT_WORK_FACTOR,function (err,salt) {
      /*  console.log(this===user);*//*false!!!!!!*/
        if(err)  return next(err);
        var password = user.password;
        bcrypt.hash(password,salt,function (err,hash) {
            console.log('hash');
            if(err) {
                console.log('hash err:' + err);
                return next(err);
            } else {
                user.password = hash;
                next();
            }

        });

    });
});

UserSchema.methods = {
    comparePassword:function (_password,cb) {
        console.log('_password =' + _password);
        console.log('this.password =' + this.password);
        bcrypt.compare(_password,this.password,function (err,isMatched) {
            if(err) return cb(err);
            cb(null,isMatched);
        });
    }
};
UserSchema.statics = {
    fetch:function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById:function (id,cb) {
        return this
            .findOne({_id:id})
            .exec(cb)
    }
}

module.exports = UserSchema;