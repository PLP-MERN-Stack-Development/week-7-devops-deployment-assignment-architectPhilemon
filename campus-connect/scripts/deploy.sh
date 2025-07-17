#!/bin/bash

# Production deployment script for Campus Connect

set -e

echo "🚀 Starting Campus Connect Production Deployment..."

# Check if required environment variables are set
check_env_vars() {
    local required_vars=(
        "MONGO_URI"
        "JWT_SECRET"
        "SUPABASE_URL"
        "SUPABASE_SERVICE_ROLE_KEY"
        "STRIPE_SECRET_KEY"
        "FRONTEND_URL"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo "❌ Error: $var environment variable is not set"
            exit 1
        fi
    done
    echo "✅ All required environment variables are set"
}

# Build frontend for production
build_frontend() {
    echo "📦 Building frontend for production..."
    npm ci --only=production
    npm run build:prod
    echo "✅ Frontend build completed"
}

# Install backend dependencies
setup_backend() {
    echo "📦 Setting up backend..."
    cd server
    npm ci --only=production
    cd ..
    echo "✅ Backend setup completed"
}

# Run database migrations
run_migrations() {
    echo "🗄️ Running database migrations..."
    # Add your migration commands here if needed
    echo "✅ Database migrations completed"
}

# Start the application
start_application() {
    echo "🚀 Starting application..."
    if [ "$1" = "docker" ]; then
        docker-compose up -d
        echo "✅ Application started with Docker"
    else
        # Start backend
        cd server
        npm run start:prod &
        BACKEND_PID=$!
        cd ..
        
        # Serve frontend (if not using a separate web server)
        npm run start &
        FRONTEND_PID=$!
        
        echo "✅ Application started"
        echo "Backend PID: $BACKEND_PID"
        echo "Frontend PID: $FRONTEND_PID"
        
        # Save PIDs for later use
        echo $BACKEND_PID > backend.pid
        echo $FRONTEND_PID > frontend.pid
    fi
}

# Health check
health_check() {
    echo "🏥 Performing health check..."
    sleep 10
    
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ Backend health check passed"
    else
        echo "❌ Backend health check failed"
        exit 1
    fi
}

# Main deployment flow
main() {
    case "$1" in
        "docker")
            check_env_vars
            start_application docker
            health_check
            ;;
        "local")
            check_env_vars
            build_frontend
            setup_backend
            run_migrations
            start_application
            health_check
            ;;
        *)
            echo "Usage: $0 {docker|local}"
            echo "  docker: Deploy using Docker Compose"
            echo "  local: Deploy locally without Docker"
            exit 1
            ;;
    esac
    
    echo "🎉 Campus Connect deployed successfully!"
    echo "📱 Frontend: ${FRONTEND_URL}"
    echo "🔧 Backend API: http://localhost:3001"
    echo "📊 Health Check: http://localhost:3001/health"
}

main "$@"