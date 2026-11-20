pipeline {
    agent {
        label 'recipehub-docker'
    }

    parameters {
        booleanParam(
            name: 'RESTORE_LOGIN',
            defaultValue: true,
            description: 'Keep login across browser reloads in the built frontend.'
        )
        booleanParam(
            name: 'DEPLOY_TO_EC2',
            defaultValue: true,
            description: 'Deploy to AWS EC2 via SSH after CI tests and container smoke tests pass.'
        )
        string(
            name: 'EC2_HOST',
            defaultValue: '3.25.166.221',
            description: 'Public IPv4 or hostname of the RecipeHub AWS EC2 server.'
        )
        string(
            name: 'EC2_USER',
            defaultValue: 'ubuntu',
            description: 'SSH username on the RecipeHub AWS EC2 server.'
        )
        string(
            name: 'EC2_APP_DIR',
            defaultValue: '/home/ubuntu/recipehub',
            description: 'Application directory on the AWS EC2 server.'
        )
    }

    environment {
        IMAGE_BACKEND = 'recipehub-api'
        IMAGE_FRONTEND = 'recipehub-frontend'
        IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT ? env.GIT_COMMIT.take(7) : 'dev'}"
        EC2_SSH_CREDENTIALS_ID = 'recipehub-ec2-ssh'
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
        stage('1. Checkout Verification') {
            steps {
                echo "=== Stage 1: Checkout & Agent Verification ==="
                echo "Building commit: ${env.GIT_COMMIT ?: 'local'} on branch: ${env.BRANCH_NAME ?: 'main'}"
                sh '''
                    set -eu
                    hostname
                    git status --short
                    docker --version
                    docker compose version
                    mkdir -p "$HOME/jenkins-agent/caches/nuget" "$HOME/jenkins-agent/caches/npm"
                '''
            }
        }

        stage('2. Backend Build & Unit Tests (.NET 10)') {
            steps {
                echo "=== Stage 2: .NET 10 Restore, Build & xUnit Tests (Containerized) ==="
                sh '''
                    set -eu
                    docker run --rm \
                        --memory=2g --cpus=1.5 \
                        -u "$(id -u):$(id -g)" \
                        -e HOME=/tmp \
                        -e DOTNET_CLI_HOME=/tmp \
                        -e DOTNET_CLI_TELEMETRY_OPTOUT=1 \
                        -e NUGET_PACKAGES=/nuget \
                        -v "$WORKSPACE:/src" \
                        -v "$HOME/jenkins-agent/caches/nuget:/nuget" \
                        -w /src \
                        mcr.microsoft.com/dotnet/sdk:10.0 \
                        sh -c '
                            set -eu
                            dotnet restore backend/RecipeHub.slnx
                            dotnet build backend/RecipeHub.slnx -c Release --no-restore
                            dotnet test backend/RecipeHub.Tests/RecipeHub.Tests.csproj -c Release --no-build \
                                --logger "console;verbosity=normal" \
                                --logger "trx;LogFileName=backend_tests.trx" \
                                --results-directory /src/TestResults
                        '
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'TestResults/*.trx', allowEmptyArchive: true
                }
            }
        }

        stage('3. Frontend Lint, Typecheck & Unit Tests (Node 20)') {
            steps {
                echo "=== Stage 3: Frontend Quality Gates & Unit Tests (Containerized) ==="
                sh '''
                    set -eu
                    docker run --rm \
                        --memory=2g --cpus=1.5 \
                        -u "$(id -u):$(id -g)" \
                        -e HOME=/tmp \
                        -e npm_config_cache=/npm-cache \
                        -e NEXT_TELEMETRY_DISABLED=1 \
                        -e NODE_OPTIONS=--max-old-space-size=1536 \
                        -v "$WORKSPACE:/src" \
                        -v "$HOME/jenkins-agent/caches/npm:/npm-cache" \
                        -w /src/frontend \
                        node:20-bookworm-slim \
                        sh -c '
                            set -eu
                            npm ci
                            npm run lint
                            npx tsc --noEmit --incremental false
                            node --test tests/*.test.mjs
                        '
                    rm -rf "$WORKSPACE/frontend/node_modules"
                '''
            }
        }

        stage('4. Build Docker Images (Sequential)') {
            steps {
                echo "=== Stage 4a: Building Backend Docker Image ==="
                sh """
                    set -eu
                    docker build --progress=plain \
                        -f infrastructure/docker/backend.Dockerfile \
                        -t ${IMAGE_BACKEND}:${IMAGE_TAG} \
                        -t ${IMAGE_BACKEND}:latest .
                """
                echo "=== Stage 4b: Building Frontend Docker Image ==="
                sh """
                    set -eu
                    docker build --progress=plain \
                        --build-arg NEXT_PUBLIC_RESTORE_SESSION=${params.RESTORE_LOGIN} \
                        -f infrastructure/docker/frontend.Dockerfile \
                        -t ${IMAGE_FRONTEND}:${IMAGE_TAG} \
                        -t ${IMAGE_FRONTEND}:latest .
                """
            }
        }

        stage('5. Container Smoke Tests') {
            steps {
                echo "=== Stage 5: Ephemeral Container Health Checks (Isolated, No Host Ports) ==="
                sh '''
                    set -eu
                    set +x
                    SMOKE_API="recipehub-smoke-api-${BUILD_NUMBER}"
                    SMOKE_WEB="recipehub-smoke-web-${BUILD_NUMBER}"
                    trap 'docker rm -f "$SMOKE_API" "$SMOKE_WEB" >/dev/null 2>&1 || true' EXIT

                    Jwt__Key=$(head -c 64 /dev/urandom | base64 | tr -d '[:space:]')
                    export Jwt__Key

                    docker run --rm -d --name "$SMOKE_API" \
                        -e ASPNETCORE_ENVIRONMENT=Development \
                        -e Jwt__Key -e Jwt__Issuer=RecipeHub-CI -e Jwt__Audience=RecipeHub-CI \
                        "$IMAGE_BACKEND:$IMAGE_TAG"

                    attempt=0
                    until docker exec "$SMOKE_API" curl --fail --silent --max-time 2 http://localhost:8080/health/live; do
                        attempt=$((attempt + 1))
                        if [ "$attempt" -ge 30 ]; then
                            echo "ERROR: Backend container did not pass /health/live before timeout."
                            docker logs "$SMOKE_API" || true
                            exit 1
                        fi
                        sleep 1
                    done
                    echo " -> Backend container /health/live PASSED"

                    docker run --rm -d --name "$SMOKE_WEB" \
                        -e NODE_ENV=production \
                        -e PORT=3000 \
                        "$IMAGE_FRONTEND:$IMAGE_TAG"

                    attempt=0
                    until docker exec "$SMOKE_WEB" node -e "fetch('http://127.0.0.1:3000/', {signal: AbortSignal.timeout(3000)}).then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"; do
                        attempt=$((attempt + 1))
                        if [ "$attempt" -ge 30 ]; then
                            echo "ERROR: Frontend container did not pass HTTP 200 check before timeout."
                            docker logs "$SMOKE_WEB" || true
                            exit 1
                        fi
                        sleep 1
                    done
                    echo " -> Frontend container HTTP 200 PASSED"
                '''
            }
        }

        stage('6. Deploy to AWS EC2 & Verify Health') {
            when {
                expression { return params.DEPLOY_TO_EC2 }
            }
            steps {
                echo "=== Stage 6: Deploying to AWS EC2 (${params.EC2_USER}@${params.EC2_HOST}) ==="
                withCredentials([sshUserPrivateKey(
                    credentialsId: env.EC2_SSH_CREDENTIALS_ID,
                    keyFileVariable: 'EC2_SSH_KEY',
                    usernameVariable: 'EC2_SSH_CRED_USER'
                )]) {
                    withEnv([
                        "TARGET_HOST=${params.EC2_HOST}",
                        "TARGET_USER=${params.EC2_USER}",
                        "TARGET_DIR=${params.EC2_APP_DIR}",
                        "TARGET_COMMIT=${env.GIT_COMMIT ?: 'origin/main'}"
                    ]) {
                        sh '''
                            set -eu
                            chmod 600 "$EC2_SSH_KEY"
                            echo "[Deploy] Loaded SSH key fingerprint:"
                            ssh-keygen -lf "$EC2_SSH_KEY"
                            ssh -i "$EC2_SSH_KEY" -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new -o BatchMode=yes -o ConnectTimeout=15 \
                                "${TARGET_USER}@${TARGET_HOST}" \
                                "TARGET_DIR='${TARGET_DIR}' TARGET_COMMIT='${TARGET_COMMIT}' bash -s" <<'REMOTE_EOF'
set -euo pipefail
cd "$TARGET_DIR"

PREV_COMMIT=$(git rev-parse HEAD)
echo "[Deploy] Previous commit on EC2: $PREV_COMMIT"

rollback() {
    echo "[Rollback] Health verification FAILED. Restoring previous commit: $PREV_COMMIT"
    git checkout --force "$PREV_COMMIT"
    docker compose build recipehub-api
    docker compose build recipehub-frontend
    docker compose up -d
    for i in $(seq 1 30); do
        if curl --fail --silent --max-time 3 http://localhost/health/live >/dev/null; then
            echo "[Rollback] Previous version restored and /health/live is Healthy."
            break
        fi
        sleep 2
    done
    exit 1
}

git fetch origin main
git checkout --force main
git reset --hard "$TARGET_COMMIT"
NEW_COMMIT=$(git rev-parse HEAD)
echo "[Deploy] Updated EC2 to commit: $NEW_COMMIT"

echo "[Deploy] Building containers sequentially (t3.small RAM-safe)..."
docker compose build recipehub-api || rollback
docker compose build recipehub-frontend || rollback
docker compose up -d || rollback

echo "[Deploy] Verifying /health/live, /health/ready and frontend / ..."
HEALTH_OK=false
for i in $(seq 1 30); do
    if curl --fail --silent --max-time 3 http://localhost/health/live >/dev/null \
       && curl --fail --silent --max-time 3 http://localhost/health/ready >/dev/null \
       && curl --fail --silent --max-time 3 http://localhost/ >/dev/null; then
        HEALTH_OK=true
        break
    fi
    sleep 2
done

if [ "$HEALTH_OK" != "true" ]; then
    docker compose ps || true
    docker compose logs --tail=30 recipehub-api recipehub-frontend || true
    rollback
fi

docker compose ps
docker image prune -f >/dev/null 2>&1 || true
echo "[Deploy] SUCCESS: RecipeHub is healthy at commit $NEW_COMMIT"
REMOTE_EOF
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline PASSED for ${IMAGE_TAG}."
        }
        failure {
            echo "Pipeline FAILED for ${IMAGE_TAG}. Inspect stage logs above."
        }
        cleanup {
            sh '''
                docker image prune -f >/dev/null 2>&1 || true
            '''
            cleanWs(cleanWhenAborted: true, cleanWhenFailure: true, cleanWhenNotBuilt: true, cleanWhenSuccess: true)
        }
    }
}
