/**
 * Created by Administrator on 2017/10/21.
 * 配置与首页的交互
 */
//index page
var Movie = require('../models/movie'); /*上层目录下*/
exports.index = function (req,res) {
    /*console.log('user in session :');
     if(req.session.user) {
     app.locals.user = req.session.user;
     console.log(req.session.user);
     }*/
    Movie.fetch(function (err,movies) {
        if(err) {
            console.log('Home page is failed. Err is:' + err);
        } else {
            res.render('index',{
                title:'首页',
                movies:movies
            });
        }
    });

};

