/**
 * Created by Administrator on 2017/10/22.
 */
/*评论模式*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId; /*mongoDB默认组件*/

var CommentSchema = new Schema({
    movie:{
        type:ObjectId,
        ref:"Movie"
    },
    from:{
        type:ObjectId,
        ref:"User"
    },
    reply:[{
        from:{type:ObjectId, ref:"User"},
        to:{type:ObjectId, ref:"User"},
        content:String
    }],
    content:String,
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

CommentSchema.pre('save',function (next) {
    if(this.isNew) {
        this.meta.creatAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

CommentSchema.statics = {
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

module.exports = CommentSchema;