const gulp = require("gulp");
const shell = require("gulp-shell");

return gulp.task('install-packages',shell.task('echo 1'))

return gulp.task('unitest',shell.task('echo 2'))

return gulp.task('default', "install-packages", "unitest")
