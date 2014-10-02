module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            wscn: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    //写在 css 文件中的 相对 路径
                    sourceMapURL: 'style.css.map',
                    sourceMapFilename: 'public/static/wscn/css/style.css.map'
                },
                files: {
                    'public/static/wscn/css/style.css': 'public/static/wscn/less/style.less'
                }
            }
        },

        watch: {
            less: {
                files: 'public/static/wscn/less/*.less',
                tasks: ['less']
            },
            livereload: {
                options: { livereload: true },
                files: ['public/static/wscn/js/**/*.js','public/static/wscn/css/**/*']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
};