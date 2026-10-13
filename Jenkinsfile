pipeline {
    agent any

    parameters {
        booleanParam(name: 'DEPLOY_FLEET', defaultValue: true, description: 'Deploy containers upon successful test verification')
    }

    environment {
        COMPOSE_PROJECT_NAME = 'lastzone'
        POSTGRES_DB = 'lastzone'
        POSTGRES_USER = 'lastzone_admin'
        POSTGRES_PASSWORD = 'secure_vanguard_secret_117'
        JWT_SECRET = 'super_secret_vanguard_jwt_signing_key_sector07_minimum_256_bits_length_117'
        FRONTEND_PORT = '80'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source repository branch...'
                checkout scm
            }
        }

        stage('Backend Unit & Integration Tests') {
            steps {
                echo 'Executing Java 21 Spring Boot security and integration test suite...'
                dir('backend') {
                    script {
                        if (isUnix()) {
                            sh 'chmod +x ./mvnw && ./mvnw clean test'
                        } else {
                            bat 'mvnw.cmd clean test'
                        }
                    }
                }
            }
            post {
                always {
                    junit testResults: 'backend/target/surefire-reports/*.xml', allowEmptyResults: true
                }
            }
        }

        stage('Backend Artifact Package') {
            steps {
                echo 'Compiling production backend executable JAR...'
                dir('backend') {
                    script {
                        if (isUnix()) {
                            sh './mvnw package -DskipTests'
                        } else {
                            bat 'mvnw.cmd package -DskipTests'
                        }
                    }
                }
            }
        }

        stage('Frontend Build & Asset Audit') {
            steps {
                echo 'Installing node dependencies & compiling Vite production bundle...'
                script {
                    if (isUnix()) {
                        sh 'npm ci && npm run build'
                    } else {
                        bat 'npm ci && npm run build'
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building multi-stage production Docker images...'
                script {
                    if (isUnix()) {
                        sh 'docker compose build'
                    } else {
                        bat 'docker compose build'
                    }
                }
            }
        }

        stage('Validate Deployment Configuration') {
            steps {
                echo 'Validating Docker Compose configuration and ports...'
                script {
                    if (isUnix()) {
                        sh 'docker compose config'
                    } else {
                        bat 'docker compose config'
                    }
                }
            }
        }

        stage('Deploy Containers') {
            when {
                expression { return params.DEPLOY_FLEET }
            }
            steps {
                echo 'Spinning up container fleet with persistent named volume...'
                script {
                    if (isUnix()) {
                        sh 'docker compose up -d --remove-orphans'
                    } else {
                        bat 'docker compose up -d --remove-orphans'
                    }
                }
            }
        }

        stage('Health & Sanity Verification') {
            when {
                expression { return params.DEPLOY_FLEET }
            }
            steps {
                echo 'Waiting for services to become healthy...'
                script {
                    if (isUnix()) {
                        timeout(time: 2, unit: 'MINUTES') {
                            sh '''
                                echo "Awaiting backend and database readiness..."
                                until curl -sSf http://localhost/api/health; do
                                    sleep 4
                                done
                                echo "LastZone deployment verified operational!"
                            '''
                        }
                    } else {
                        timeout(time: 2, unit: 'MINUTES') {
                            bat '''
                                @echo off
                                echo Awaiting backend and database readiness...
                                powershell -Command "for ($i=0; $i -lt 30; $i++) { try { $res = Invoke-RestMethod -Uri 'http://localhost/api/health' -TimeoutSec 3; if ($res.status -eq 'UP') { Write-Host 'Healthcheck passed: UP'; exit 0 } } catch {}; Start-Sleep -Seconds 4 }; exit 1"
                            '''
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo '=================================================='
            echo 'PIPELINE SUCCESSFUL: Quality gates passed & deployed'
            echo '=================================================='
        }
        failure {
            echo '=================================================='
            echo 'PIPELINE FAILED: Halting downstream deployment'
            echo '=================================================='
            script {
                if (isUnix()) {
                    sh 'docker compose logs --tail=50 || true'
                } else {
                    bat 'docker compose logs --tail=50 || exit 0'
                }
            }
        }
    }
}
