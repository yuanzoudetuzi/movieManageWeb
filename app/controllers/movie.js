/**
 * Created by Administrator on 2017/10/21.
 * 处理与电影信息有关的交互
 */
//实现新的对象的字段，替换旧的对象中对应的字段
var  _ = require('underscore');
var Movie = require('../models/movie');/*上层目录下*/
var Comment = require('../models/comment');
var Category = require('../models/category');
var fs = require('fs');
var path = require('path');
//admin page
exports.new = function (req,res) {
    Category.find({},function (err,categories) {
        res.render('admin',{
            title:'电影管理页面',
            categories:categories,
            movie:  {
                title:'',
                doctor:'',
                country:'',
                year:'',
                poster:'',
                flash:'',
                summary:'',
                language:''
            }
        });
    })

};

//list page
exports.list = function (req,res) {
    Movie.fetch(function (err,movies) {
        if(err) {
            console.log('Home page is failed. Err is:' + err);
        } else {
            res.render('list',{
                title:'列表页',
                movies:movies
            });
        }
    });
};

//detail page
exports.detail  = function (req,res) {
    var id = req.params.id;
    Movie.update({_id:id},{$inc:{pv:1}},function (err,movie) {
        if(err) {
            console.log(err);
        }
    });
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
            if (err) {
                console.log(err);
                return;
            }
            Category.find({},function (err,categories) {
                if(err) {
                    console.log(err);
                } else {
                    res.render('admin',{
                        title:'更新页面',
                        movie:movie,
                        categories:categories
                    });
                }
            });

        })
    }
};

//存储海报
exports.savePoster = function (req,res,next) {

     console.log('files.movie= ');
     console.log(req.files.movie);
    var posterData = req.files.movie.uploadPoster;
     var filePath = posterData.path;
     var originalFileName = posterData.originalFilename;

     if(originalFileName) {   /*如果上传了这个文件*/
          fs.readFile(filePath,function (err,data) {
                var timestamp = Date.now();
                var type = posterData.type.split('/')[1];
                var poster = timestamp + '.' + type;
                var newPath = path.join(__dirname,'../../','/public/upload/' + poster);
                fs.writeFile(newPath,data,function (err) {
                    req.poster = poster;  /*将心的poster挂在req上*/
                    next();
                });
          });
     } else {
         next();
     }
};

//处理录制信息
exports.save = function (req,res) {
    var movieObject = req.body.movie;
    var id = movieObject._id;
    var categoryId = movieObject.category;
    var categoryName =movieObject.categoryName;
    var _movie;
    if(req.poster) {   /*如果上传了海报，选择上传的海报*/
        movieObject.poster = '/upload/' + req.poster;
        console.log('poster = ' +  movieObject.poster)
    }
    if(id) {
        Movie.findById(id,function (err,movie) {
            //更新数据库中的值
            if(err) {
                console.log('Get movie is failed.err:' +err);
            }else {
                _movie = _.extend(movie,movieObject);
                _movie.save(_movie,function (err,movie) {
                    if(err) {
                        console.log('保存数据失败。ERR:' + err)
                       return res.redirect('/admin/movie');
                    }
                    res.redirect('/movie/' + movie._id);
                });
            }

        });
    } else {
        _movie = new Movie(movieObject);
        _movie.save(_movie,function (err,movie) {
            if(err) {
                console.log('保存数据失败。ERR:' + err);
            } else {
                /*在对应的分类中存入该电影*/
                if(categoryId) {      /*category 标签被选择时*/
                    Category.findById(categoryId,function (err,category) {
                        if(err) {
                            console.log(err);
                            return res.redirect('/admin/movie');
                        } else {
                            category.movies.push(movie._id);
                            category.save(function (err,category) {
                                if(err){
                                    return res.redirect('/admin/movie');
                                }
                                res.redirect('/movie/' + movie._id);
                            })
                        }
                    });
                } else if(categoryName){    /*新增了一个类*/
                     var category = new Category({
                         name:categoryName,
                         movies:[movie._id]
                     });
                     category.save(function (err,category) {
                         if(err){
                             console.log(err);
                             return res.redirect('/admin/movie');
                         }
                         /*保存movie的分类*/
                         movie.category = category._id;
                         movie.save(function (err,mo) {
                             if(err){
                                 return res.redirect('/admin/movie');
                             }
                             res.redirect('/movie/' + mo._id)
                         });

                     });
                }
            }
        });
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

