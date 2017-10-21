/**
 * Created by Administrator on 2017/10/21.
 * 路由文件
 */
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
module.exports = function (app) {
    /*预处理 回话信息*/
    app.use(function (req,res,next) {
        app.locals.user = req.session.user;
        return next();
    });
//index page
    app.get('/',Index.index);


//Movie
    app.get('/admin/movie',Movie.save);
    app.get('/admin/list',Movie.list);
    app.get('/movie/:id',Movie.detail);
    app.get('/admin/update/:id',Movie.update);
    app.post('/admin/movie/new',Movie.new);
    app.delete('/admin/list',Movie.del);

//User
    app.get('/user/list',User.list);
    app.post('/user/signup',User.signup);
    app.post('/user/signin',User.signin);
    app.get('/logout',User.logout);
};
