import gulp from 'gulp';
import scp from 'gulp-scp2';
import gulpSSH from 'gulp-ssh';
import dotenv from 'dotenv';


export const copyEnvFile = gulp.series(console.log);
export const deploy = gulp.series(console.log);
