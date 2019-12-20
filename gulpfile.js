const gulp = require("gulp");
const shell = require("gulp-shell");
const pm2 = require("pm2");
const isEmpty = require("lodash/isEmpty");
const ecosystemConfig = require("./ecosystem.config").apps[0];

const connectPM2 = () => {
  return new Promise((resolve, reject) => {
    pm2.connect(error => {
      if(error) return reject(error);
      return resolve();
    })
  })
};

const getProcesses = () => {
  return new Promise((resolve, reject) => {
    pm2.list((error, processes) => {
      if(error) return reject(error);
      return resolve(processes);
    })
  })
};

const getProcessData = (name) => {
  return new Promise((resolve, reject) => {
    pm2.list((error, processes) => {
      if(error) return reject(error);
      const processData = processes.find(p => p.name === name);
      if(isEmpty(processData)) return reject(new Error("empty"));
      return resolve(processData);
    })
  })
};

const getProcessStatus = (name) => {
  return new Promise((resolve, reject) => {
    pm2.list((error, processes) => {
      if(error) return reject(error);
      const processData = processes.find(p => p.name === name);

      if(isEmpty(processData)) resolve("errored");
      return resolve(processData.pm2_env.status);
    })
  });
};

const stopProcess = (processData) => {
  return new Promise((resolve, reject) => {
    pm2.stop(processData, (error, nextProcess) => {
      if(error) throw error;
      resolve(nextProcess);
    })
  });
}

const startProcess = (processData) => {
  return new Promise((resolve, reject) => {
    pm2.start(ecosystemConfig, (error, nextProcess) => {
      if (error)  return reject(error);
      return resolve(nextProcess);
    });
  });
};

const restartProcess = (processData) => {
  return new Promise((resolve, reject) => {
    pm2.restart(processData, (error, nextProcess) => {
      if (error)  return reject(error);
      return resolve(nextProcess);
    });
  });
};

const disconnectProcess = () => pm2.disconnect();

gulp.task("default", async (done) => {
  try {
    const processes = await getProcesses();
    const processData = await getProcessData('foodmate-ws-api');
    const {status} = processData.pm2_env;
    await disconnectProcess();

    const commandLine = status === "online"
      ? "pm2 restart foodmate-ws-api"
      : "pm2 start foodmate-ws-api";

    return gulp
      .src("./server.js", {read: true})
      .pipe(shell([commandLine]));
  }catch(error) {
    await disconnectProcess();
    done();
  }
});
