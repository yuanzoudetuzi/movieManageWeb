/**
 * Created by Administrator on 2017/10/19.
 */
module.exports = function (grunt) {

    grunt.initConfig({
        watch:{
            pug:{
                files:['app/views/**'],
                options: {
                    livereload:true  /*任务完成后，自动重启服务器*/
                }
            },
            js:{
                files:['public/js/**','app/model/**/*.js','app/schemas/**/*.js'],
                //tasks:['jshint'], //语法检查
                options: {
                    livereload:true
                }
            }
        },
        nodemon:{
            dev: {
                script: 'app.js',
                options: {
                    args: [], 
                    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
                    ext: 'js',
                    watch: ['./'],
                    delay: 500,
                    env: {
                        PORT: '8000'
                    },
                    cwd: __dirname
                }
            }
        },

        mochaTest:{
            options:{
                reporter:"spec"
            },
            src:["test/**/*.js"]
        },

        concurrent: {
            tasks:['watch','nodemon'],
            options:{
                logConcurrentOutput:true
            }
        }
    });
    /*文件增删查改时，执行任务*/
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon'); /*app.js（入口文件）有变化式，自动重启*/
    grunt.loadNpmTasks('grunt-concurrent'); /*慢任务开发，优化构建时间和跑多个阻塞任务app.js有变化式，自动重启*/
    grunt.loadNpmTasks('grunt-mocha-test'); /*单元测试*/
    grunt.option('force',true);           /*避免语法错误的影响*/
    grunt.registerTask('default',['concurrent']);

}