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

exports.search = function (req,res) {
    var catId = req.query.cat;
    console.log('catId = ' + catId);
    var page = parseInt(req.query.p);
    var count = 2;
    var index = page*count;
    Category
        .find({_id:catId})
        .populate({
            path:'movies'
        })
        .exec(function (err,categories) {
            if(err) {
                console.log(err);
                return  res.redirect('/');
            } else {
                var category = categories[0] || {};
                var movies = category.movies || [];
                var results = movies.slice(index,index+count);
                var keyword = category.name;
                res.render('results',{
                    title:'结果列表页面',
                    keyword:keyword,
                    currentPage:(page+1),
                    query:"cat=" + category._id,
                    totalPage:Math.ceil(movies.lenght/count),
                    results:results
                });
            }
        });
};
