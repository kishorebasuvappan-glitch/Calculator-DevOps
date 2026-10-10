pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'kishorebasuvappan/calculator'
        IMAGE_TAG = 'v2.0'

        AZURE_TENANT_ID = '35501cb3-d5d0-475b-a5c5-69f6e8f5e62f'
        AZURE_SUBSCRIPTION_ID = 'fcb39d30-fdd6-41a0-98f2-2c267c93c163'
        AKS_RESOURCE_GROUP = 'NetworkWatcherRG'
        AKS_CLUSTER_NAME = 'demo'
    }

    stages {

        stage('GitHub') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/kishorebasuvappan-glitch/Calculator-DevOps.git'
            }
        }

        stage('Build Image') {
            steps {
                sh '''
                    docker build -t calculator:1.2 .
                '''
            }
        }

        stage('Tag Image') {
            steps {
                sh '''
                    docker tag calculator:1.2 ${DOCKER_IMAGE}:${IMAGE_TAG}
                '''
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
                        set +x
                        echo "$DOCKER_PASSWORD" | docker login \
                            -u "$DOCKER_USERNAME" --password-stdin

                        docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Azure AKS') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'azure-aks-credentials',
                        usernameVariable: 'AZURE_CLIENT_ID',
                        passwordVariable: 'AZURE_CLIENT_SECRET'
                    )
                ]) {
                    sh '''
                        set -e
                        set +x

                        # Login to Azure
                        az login \
                            --service-principal \
                            --username "$AZURE_CLIENT_ID" \
                            --password "$AZURE_CLIENT_SECRET" \
                            --tenant "$AZURE_TENANT_ID" \
                            --output none

                        # Select subscription
                        az account set \
                            --subscription "$AZURE_SUBSCRIPTION_ID"

                        # Connect to AKS cluster
                        az aks get-credentials \
                            --resource-group "$AKS_RESOURCE_GROUP" \
                            --name "$AKS_CLUSTER_NAME" \
                            --overwrite-existing

                        # Deploy calculator application
                        kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: calculator
spec:
  replicas: 2
  selector:
    matchLabels:
      app: calculator
  template:
    metadata:
      labels:
        app: calculator
    spec:
      containers:
        - name: calculator
          image: ${DOCKER_IMAGE}:${IMAGE_TAG}
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: calculator-service
spec:
  type: LoadBalancer
  selector:
    app: calculator
  ports:
    - port: 80
      targetPort: 80
EOF

                        # Wait for rollout
                        kubectl rollout status deployment/calculator \
                            --timeout=180s

                        # Display deployment information
                        kubectl get deployments
                        kubectl get pods
                        kubectl get service calculator-service

                        az logout
                    '''
                }
            }
        }
    }

    post {
        always {
            sh '''
                docker rmi calculator:1.2 --force || true
                docker rmi ${DOCKER_IMAGE}:${IMAGE_TAG} --force || true
                docker image prune -f || true
            '''
        }

        success {
            echo 'CI/CD pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the stage logs above.'
        }
    }
}
