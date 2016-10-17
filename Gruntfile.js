module.exports = function(grunt) { //imports Grunt into the project
    grunt.initConfig({ //these are instructions for Grunt
        pkg: grunt.file.readJSON('package.json'), //all the individual directions for Grunt
        sass: {
            dist: {
                options: {
                    style: 'compressed' //how it's going to be compiled
                },
                files: {
                    'lib/styles/main.min.css': 'src/styles/main.scss'
                }
            }
        },
        uglify: {
            options: {
                preserveComments: false
            },
            my_target: {
                files: {
                    'lib/js/main.min.js': ['lib/js/main.js']
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/js/*.js'],
                dest: 'lib/js/main.js'
            }
        },
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'images/'
                }]
            }
        },
        watch: {
            css: {
                files: ['src/styles/**/*'],
                tasks: ['sass']
            },
            javascript: {
                files: ['src/js/**/*'],
                tasks: ['concat', 'uglify']
            },
            img: {
                files: ['images/**/*'],
                tasks: ['imagemin']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass'); //including script we are going to reference in our code - have it load first
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin'); 
    grunt.registerTask('default', ['sass', 'watch', 'imagemin', 'concat', 'uglify']);
};
