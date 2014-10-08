module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            avnpc: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    //写在 css 文件中的 相对 路径
                    sourceMapURL: 'style.css.map',
                    sourceMapFilename: 'public/static/avnpc/css/style.css.map'
                },
                files: {
                    'public/static/avnpc/css/style.css': 'public/static/avnpc/less/style.less'
                }
            }
        },

        watch: {
            less: {
                files: 'public/static/avnpc/less/*.less',
                tasks: ['less']
            },
            livereload: {
                options: { livereload: true },
                files: ['public/static/avnpc/js/**/*.js','public/static/avnpc/css/**/*']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
};