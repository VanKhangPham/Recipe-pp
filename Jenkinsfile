pipeline {
    agent any

    parameters {
        booleanParam(name: 'RESTORE_LOGIN', defaultValue: false, description: 'Keep login across browser reloads in the built frontend. Enable for the deployment build.')
    }

    environment {
        IMAGE_BACKEND = 'recipehub-api'
        IMAGE_FRONTEND = 'recipehub-frontend'
        IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT ? env.GIT_COMMIT.take(7) : 'dev'}"
        DOTNET_CLI_TELEMETRY_OPTOUT = '1'
        NEXT_TELEMETRY_DISABLED = '1'
        NEXT_PUBLIC_RESTORE_SESSION = "${params.RESTORE_LOGIN}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout Verification') {
            steps {
                echo "=== Stage 1: Checkout & Verification ==="
                echo "Building commit: ${env.GIT_COMMIT ?: 'local'} on branch: ${env.BRANCH_NAME ?: 'main'}"
                sh 'git status --short'
            }
        }

        stage('Restore & Build Backend') {
            steps {
                echo "=== Stage 2: .NET 10 Solution Restore & Build ==="
                sh 'dotnet restore backend/RecipeHub.slnx'
                sh 'dotnet build backend/RecipeHub.slnx -c Release --no-restore'
            }
        }

        stage('Backend Tests') {
            steps {
                echo 'Running xUnit tests. PostgreSQL tests require RECIPEHUB_RUN_POSTGRES_TESTS and an isolated test connection.'
                sh 'dotnet test backend/RecipeHub.Tests/RecipeHub.Tests.csproj -c Release --no-build --logger "trx;LogFileName=backend_tests.trx" --results-directory ./TestResults'
            }
            post {
                always {
                    mstest testResultsFile: 'TestResults/backend_tests.trx', keepLongStdio: true
                }
            }
        }

        stage('Frontend Checks and Build') {
            steps {
                echo "=== Stage 5: Installing packages & Building Next.js Frontend ==="
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run lint'
                    sh 'npx tsc --noEmit --incremental false'
                    sh 'node --test tests/*.test.mjs'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "=== Stage 6: Building & Tagging Docker Containers ==="
                // Backend Image
                sh "docker build -f infrastructure/docker/backend.Dockerfile -t ${IMAGE_BACKEND}:${IMAGE_TAG} -t ${IMAGE_BACKEND}:latest ."
                // Frontend Image
                sh "docker build --build-arg NEXT_PUBLIC_RESTORE_SESSION=${params.RESTORE_LOGIN} -f infrastructure/docker/frontend.Dockerfile -t ${IMAGE_FRONTEND}:${IMAGE_TAG} -t ${IMAGE_FRONTEND}:latest ."
            }
        }

        stage('Container Smoke Test') {
            steps {
                sh '''
                    set -eu
                    set +x
                    SMOKE_CONTAINER=$(printf '%s' "$BUILD_TAG" | tr -c 'a-zA-Z0-9_.-' '-')
                    trap 'docker rm -f "$SMOKE_CONTAINER" >/dev/null 2>&1 || true' EXIT
                    Jwt__Key=$(head -c 64 /dev/urandom | base64 | tr -d '\\n')
                    export Jwt__Key
                    docker run --rm -d --name "$SMOKE_CONTAINER" \
                        -e ASPNETCORE_ENVIRONMENT=Development \
                        -e Jwt__Key -e Jwt__Issuer=RecipeHub-CI -e Jwt__Audience=RecipeHub-CI \
                        "$IMAGE_BACKEND:$IMAGE_TAG"
                    attempt=0
                    until docker exec "$SMOKE_CONTAINER" curl --fail --silent --max-time 2 http://localhost:8080/health/live; do
                        attempt=$((attempt + 1))
                        if [ "$attempt" -ge 30 ]; then
                            echo "API did not become live before the timeout."
                            exit 1
                        fi
                        sleep 1
                    done
                '''
            }
        }

        stage('Local Image Summary') {
            steps {
                echo "Local images: ${IMAGE_BACKEND}:${IMAGE_TAG}, ${IMAGE_FRONTEND}:${IMAGE_TAG}"
                echo 'Registry publication and AWS deployment require separate configuration and approval.'
            }
        }
    }

    post {
        success {
            echo "Pipeline PASSED for ${IMAGE_TAG}. Review test reports, including skipped tests, before release."
        }
        failure {
            echo "Pipeline FAILED: Please check test results or build logs above. Deployment blocked."
        }
        cleanup {
            cleanWs(cleanWhenAborted: true, cleanWhenFailure: true, cleanWhenNotBuilt: true, cleanWhenSuccess: true)
        }
    }
}
