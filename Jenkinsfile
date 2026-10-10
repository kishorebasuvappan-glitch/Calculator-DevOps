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
                sh 'docker build -t calculator:1.2 .'
            }
        }

        stage('Tag Image') {
            steps {
                sh 'docker tag calculator:1.2 kishorebasuvappan/calculator:v2.0'
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
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login \
                            -u "$DOCKER_USERNAME" --password-stdin

                        docker push kishorebasuvappan/calculator:v2.0
                    '''
                }
            }

            post {
                always {
                    sh '''
                        docker rmi nginx:alpine --force || true
                        docker image prune -f
                        docker logout || true
                    '''
                }
            }
        }
    }
}
