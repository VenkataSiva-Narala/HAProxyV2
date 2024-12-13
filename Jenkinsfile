pipeline {
    agent any

    tools {
        nodejs 'Nodejs' // Use the NodeJS installation configured in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the source code from the repository
                git 'https://github.com/devarajareddy92/HAProxyV2.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                // Use NodeJS wrapper to ensure the environment is set up correctly
                withEnv(['PATH+NODEJS=${tool name: "Nodejs"}/bin']) {
                    sh 'npm install'
                }
            }
        }
        stage('Build') {
            steps {
                withEnv(['PATH+NODEJS=${tool name: "Nodejs"}/bin']) {
                    // Build the React application
                    sh 'npm run build'
                }
            }
        }
        stage('Test') {
            steps {
                withEnv(['PATH+NODEJS=${tool name: "Nodejs"}/bin']) {
                    // Run tests
                    sh 'npm test'
                }
            }
        }
        stage('Deploy') {
            steps {
                // Deploy the application (this step will vary based on your deployment method)
                // Example: copying build files to a web server
                withEnv(['PATH+NODEJS=${tool name: "Nodejs"}/bin']) {
                    sh '''
                    if [ -d /var/www/html ]; then
                        sudo rm -rf /var/www/html/*
                        sudo cp -r build/* /var/www/html/
                    fi
                    '''
                }
            }
        }
    }

    post {
        success {
            // Actions to perform on successful build
            echo 'Build completed successfully!'
        }
        failure {
            // Actions to perform on failed build
            echo 'Build failed!'
        }
    }
}
