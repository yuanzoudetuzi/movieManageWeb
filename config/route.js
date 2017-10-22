/**
 * Created by Administrator on 2017/10/21.
 * 路由文件
 */
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');
module.exports = function (app) {
    /*预处理 回话信息*/
    app.use(function (req,res,next) {
        app.locals.user = req.session.user;
        return next();
    });
//index page
    app.get('/',Index.index);


//Movie
    app.get('/movie/:id',Movie.detail);
    app.get('/admin/movie',User.signinRequired,User.adminRequired,Movie.save);
    app.get('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.list);
    app.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update);
    app.post('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.new);
    app.delete('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.del);

//User
    app.get('/admin/user/list',User.signinRequired,User.adminRequired,User.list);
    app.post('/user/signup',User.signup);
    app.post('/user/signin',User.signin);
    app.get('/signin',User.showSignin);
    app.get('/signup',User.showSignup);
    app.get('/logout',User.logout);

//comment
    app.post('/user/comment',User.signinRequired,Comment.save);

//category
    app.get('/admin/category',User.signinRequired,User.adminRequired,Category.new);
    app.post('/admin/category/new',User.signinRequired,User.adminRequired,Category.save);
    app.get('/admin/category/list',User.signinRequired,User.adminRequired,Category.list);
};
