import gulp from 'gulp';
import scp from 'gulp-scp2';
import gulpSSH from 'gulp-ssh';
import dotenv from 'dotenv';

const config = dotenv.config().parsed;
// const {BRANCH} = process.env;
const BRANCH = 'master';

function copyEnvFileTask() {
  const sshConfig = {
    host: '10.100.10.217',
    username: 'useradm',
    password: 'password'
  };
  const remoteServer = new gulpSSH({
    ignoreErrors: false,
    sshConfig
  });
  return remoteServer
    .shell(`cp /var/local/envs/privacy-operation-system-api/${BRANCH}.env /var/www/html/devapi.privacy-system.net/.env`, {filePath: `${BRANCH}.env`})
    .on('error', error => {
      throw error;
    });
}

function deployToServerTask() {
  const scpConfig = {
    host: config['SERVER_HOST'],
    dest: config['SERVER_DEST'],
    username: config['SERVER_USERNAME'],
    password: config['SERVER_PASSWORD']
  };
  
  return gulp
    .src('./**/*')
    .pipe(
      scp(scpConfig)
    ).on('error', error => {
      throw error;
    });
}

export const copyEnvFile = gulp.series(copyEnvFileTask);
export const deploy = gulp.series(deployToServerTask);
