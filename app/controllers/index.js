/**
 * Created by Administrator on 2017/10/21.
 * 配置与首页的交互
 */
//index page
var Movie = require('../models/movie'); /*上层目录下*/
var Category = require('../models/category');
exports.index = function (req,res) {
        Category
        .find()
        .populate({path:'movies',options:{limit:5}})
        .exec(function (err,categories) {
            if(err) {
                console.log(err);
            } else {
                console.log('categories = ');
                console.log(categories);
               res.render('index',{
                    title:'电影网',
                    categories:categories
               });
            }
        });
};

