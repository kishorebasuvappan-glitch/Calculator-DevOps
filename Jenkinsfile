pipeline {
    agent any

    stages {

        stage('GitHub') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-credentials',
                    url: 'https://github.com/kishorebasuvappan-glitch/Calculator-DevOps.git'
            }
        }

        stage('Build Image') {
            steps {
                bat 'docker build -t calculator:1.2 .'
            }
        }

        stage('Tag Image') {
            steps {
                bat 'docker tag calculator:1.1 kishorebasuvappan/calculator:v2.0'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    // Using -p directly prevents the 2-minute timeout/hang on Windows batch steps
                    bat 'docker login -u %DOCKER_USERNAME% -p %DOCKER_PASSWORD%'
                    bat 'docker push kishorebasuvappan/calculator:v2.0'
                }
            }
            post {
                always {
                    // Ensures logout always executes even if the push fails
                    bat 'docker rmi nginx:alpine --force'
                    bat 'docker image prune -f'
                    bat 'docker logout'
                }
            }
        }
    }
}
