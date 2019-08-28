pipeline {
  agent any
  tools {nodejs "Nodejs 10.16.0"}
  environment {
    BRANCH="${GIT_BRANCH.split("/")[1]}"
    PACKAGE_NAME="privacy-operation-system-api"
  }
  stages{
    stage("init") {
      steps {
        sh "yarn install"
        sh "gulp copyEnvFile"
        sh "mv master.env .env"
      }
    }
    stage("test") {
      steps {
        sh "yarn test:CI"
      }
       post {
        always {
          publishHTML target: [
            allowMissing         : false,
            alwaysLinkToLastBuild: false,
            keepAll             : true,
            reportDir            : 'output/coverage/jest',
            reportFiles          : 'index.html',
            reportName           : 'Test Report'
          ]
        }
      }
    }
    stage("deploy") {
      when {
        expression {
          currentBuild.result == null || currentBuild.result == "SUCCESS"
        }
      }
      steps {
        sh "gulp deploy"
        deleteDir()
      }
    }
  }
}
