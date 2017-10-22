/**
 * Created by Administrator on 2017/10/21.
 * 处理与用户注册，登陆，登出的交互
 */
/*处理注册请求*/
var User = require('../models/user'); /*上层目录下*/
exports.signup = function (req,res) {
    var _user = req.body.user;
    /*    var _user = req.para['user']; *//*对params>body>query的封装*/
    console.log('注册：');
    console.log(_user);
    /*使用findOne，而不是find*/
    User.findOne({name:_user.name},function (err,user) {
        if(err) {
            console.log('ERR:'+err);
        }
        if(user){
            console.log('用户名已存在');
            return res.redirect('/signin');
        } else {
            var tempUser = new User(_user);
            tempUser.save(function (err,user) {
                if(err) {
                    console.log('Signup is failed.Err: ' +err);
                    res.redirect('/signup')
                } else {
                    res.redirect('/signin');
                }
            });
        }
    });

};

/*处理登陆请求*/
exports.signin = function (req,res) {
    var _user = req.body.user;
    console.log('登陆：');
    console.log(_user);
    User.findOne({name:_user.name},function (err,user) {
        if(err) {
            console.log('ERR:'+err);
        } else {
            if(!user){
                console.log('用户不存在')
                return res.redirect('/signup');
            }
            user.comparePassword(_user.password,function (err,isMatched) {
                if(err){
                    console.log(err);
                } else {
                    if(isMatched){
                        req.session.user = user;
                        console.log('password is matched');
                        return res.redirect('/');
                    } else {
                        console.log('password is not matched');
                        return res.redirect('/signin');
                    }
                }
            })
        }
    });
};

/*访问注册页面*/
exports.showSignup = function (req,res) {
    res.render('signup',{
       title:"注册页面"
    });
};

/*访问登陆页面*/
exports.showSignin = function (req,res) {
    res.render('signin',{
        title:"登陆页面"
    });
};


/*处理登出请求*/
exports.logout = function (req,res) {
    delete req.session.user;
  /*  delete app.locals.user;*/
    res.redirect('/');
};


//user list page
exports.list = function (req,res) {
    User.fetch(function (err,users) {
        if(err) {
            console.log('User list page is failed. Err is:' + err);
        } else {
            res.render('userlist',{
                title:'用户列表页',
                users:users
            });
        }
    });
};

/*midware for user*/
exports.signinRequired = function (req,res,next) {
    var user = req.session.user;
    console.log('user = ' );
    console.log(user);
    if(!user) {
       return res.redirect('/signin');
    }
    next();
};

exports.adminRequired = function (req,res,next) {
    var user = req.session.user;
    if(user.role<=10) {
       return res.redirect('/signin');
    }
    next();
};