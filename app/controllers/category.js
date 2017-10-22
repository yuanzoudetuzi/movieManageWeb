/**
 * Created by Administrator on 2017/10/22.
 * 处理分类管理交互
 */

//实现新的对象的字段，替换旧的对象中对应的字段
var  _ = require('underscore');
var Category = require('../models/category');
//admin new page
exports.new = function (req,res) {
   res.render('category_admin',{
       title:'分类录入页面',
       category:{}
   });
};
//admin post category
exports.save = function (req,res) {
    var _category = req.body.category;
    var category = new Category(_category);
    category.save(function (err,category) {
        if(err) {
            console.log(err);
        } else {
            /*res.redirect('/');*/
            res.render('/admin/category/list');
        }
    });
};

//list page
exports.list = function (req,res) {
    Category.fetch(function (err,categories) {
        if(err) {
            console.log('Category list page is failed. Err is:' + err);
        } else {
            res.render('category_list',{
                title:'分类列表页',
                categories:categories
            });
        }
    });
};

//detail page
exports.detail  = function (req,res) {
    var id = req.params.id;
    Movie.findById(id,function (err,movie) {
        if(err) {
            console.log('detail is failed,err is ' + err);
        } else {
            if(movie) {
                Comment
                    .find({movie:id})
                    .populate('from','name')
                    .populate('reply.from reply.to','name')
                    . exec(function (err,comments) {
                        console.log('comments =');
                        console.log(comments);
                        if(err){
                            console.log(err);
                        } else {
                            res.render('detail',{
                                title:movie.title,
                                movie:movie,
                                comments:comments
                            });
                        }
                    });

            } else {
                console.log('The movie is not exist.')
            }

        }

    });
};

// 处理更新信息
exports.update = function (req,res) {
    var id = req.params.id;
    if(id) {
        Movie.findById(id,function (err,movie) {
            if(err) {
                console.log('更新失败，ERR:' + err);
            } else {
                res.render('admin',{
                    title:'更新页面',
                    movie:movie
                });
            }
        })
    }
};



/*处理删除请求*/
exports.del = function (req,res) {
    var id = req.query.id;
    if (id) {
        Movie.remove({_id:id},function (err,movie) {
            if(err) {
                console.log('Delete movie is failed, ERR is ' + err);
            } else {
                res.json({success:1});
            }
        })
    }
};

