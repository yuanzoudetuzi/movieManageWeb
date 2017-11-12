/**
 * Created by Administrator on 2017/10/17.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
/*进行持久化链接*/
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var connectMultiparty = require('connect-multiparty'); /*处理multipart/formd-data类型的数据*/
var fs = require('fs');
var app = express();
var port = process.env.PORT || 8000;
app.locals.moment = require('moment');

var models_path = __dirname + "/app/models";
/*var walk = function (path) {
    fs
        .readirSync(path)
        .forEach(function (file) {
            var newPath = path + '/' +file;
            var stat = fs.statSync(newPath);
            if(stat.isFile()) {
                if(/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath);
                }
            } else if(stat.isDirectory()) {
                walk(newPath);
            }
        });
};
walk(models_path);*/
//设置视图文件地址
app.set('views','./app/views/pages');
// 设置模板引擎
app.set('view engine','pug');
//设置静态资源文件地址
app.use(express.static(path.join(__dirname,'public')));
//处理表单提交数据  parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
/*解析cookie中的session-id*/
app.use(cookieParser());
app.use(connectMultiparty());
// 设置 session 的可选参数
var dbUrl = 'mongodb://localhost/movie';
app.use(session({
    secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 1000 },
    store:new mongoStore({  /*指定session存储方式*/
        url: dbUrl,
        collection:'sessions'
    })
}));

/*进行配置*/
if('development'===app.get('env')) { /*是开发环境的话*/
    app.set('showStackError',true);
    app.use(logger(':method :url :status'));
    app.locals.pretty =true; /*设置输入格式*/
    mongoose.set('debug',true);
} else {

}
require('./config/route.js')(app);
//监听端口
app.listen(port);
console.log('listen at ' + port);
mongoose.connect(dbUrl,{useMongoClient:true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('连接数据库成功')
});
