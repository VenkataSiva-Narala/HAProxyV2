pipeline {
    agent any
    tools {
        nodejs 'Nodejs' // Use the NodeJS installation configured in Jenkins
    }
    environment {
        DOCKER_IMAGE_NAME = 'myapp2' // Name of the Docker image
        DOCKER_HUB_REPO = 'devarajareddy/haproxxyfrontend' // Docker Hub repository
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'new-junkins-branch', url: 'https://github.com/VenkataSiva-Narala/HAProxyV2.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                withEnv(['PATH+NODEJS=${tool name: "Nodejs"}/bin']) {
                    sh 'npm install'
                }
            }
        }
        stage('Build') {
            steps {
                withEnv(['PATH+NODEJS=${tool name: "Nodejs"}/bin']) {
                    sh 'CI= npm run build'
                }
            }
        }
 
        stage('Build Docker Image') {
            steps {
                sh 'sudo docker build -t ${DOCKER_IMAGE_NAME}:latest .'
            }
        }
        stage('Run Docker Container') {
            steps {
                sh 'sudo docker run -d -p 8086:80 ${DOCKER_IMAGE_NAME}:latest' // Maps container's port 80 to host's port 8083
            }
        }
      
    }
    post {
        success {
            echo 'Build, deployment, and Docker Hub push completed successfully!'
        }
        failure {
            echo 'Build, deployment, or Docker Hub push failed!'
        }
    }
}
