/**
 * Created by Administrator on 2017/10/21.
 * 处理与电影信息有关的交互
 */
//实现新的对象的字段，替换旧的对象中对应的字段
var  _ = require('underscore');
var Movie = require('../models/movie');/*上层目录下*/

//admin page
exports.save = function (req,res) {
    res.render('admin',{
        title:'管理页面',
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
    console.log('movie/id =' +id);
    Movie.findById(id,function (err,movie) {
        if(err) {
            console.log('detail is failed,err is ' + err);
        } else {
            if(movie) {
                res.render('detail',{
                    title:movie.title,
                    movie:movie
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

//处理录制信息
exports.new = function (req,res) {
    var id = req.body.movie._id;
    var movieObject = req.body.movie;
    /*  console.log('movie id = ' + id + " ,movie = " + movieObject.title);*/
    var _movie;
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
                    }
                    res.redirect('/movie/' + movie._id);
                });
            }

        })
    } else {
        _movie = new Movie({
                doctor: movieObject.doctor,
                title: movieObject.title,
                country: movieObject.country,
                language: movieObject.language,
                year: movieObject.year,
                poster:movieObject.poster,
                summary:movieObject.summary,
                flash:movieObject.flash
            }
        );
        _movie.save(_movie,function (err,movie) {
            if(err) {
                console.log('保存数据失败。ERR:' + err);
            }
            console.log('_id = ' + movie._id);
            res.redirect('/movie/' + movie._id);
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

