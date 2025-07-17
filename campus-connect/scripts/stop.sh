#!/bin/bash

# Stop Campus Connect application

echo "🛑 Stopping Campus Connect..."

# Stop Docker containers if running
if [ -f "docker-compose.yml" ] && docker-compose ps | grep -q "Up"; then
    echo "🐳 Stopping Docker containers..."
    docker-compose down
    echo "✅ Docker containers stopped"
fi

# Stop local processes if running
if [ -f "backend.pid" ]; then
    BACKEND_PID=$(cat backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo "✅ Backend process stopped (PID: $BACKEND_PID)"
    fi
    rm backend.pid
fi

if [ -f "frontend.pid" ]; then
    FRONTEND_PID=$(cat frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo "✅ Frontend process stopped (PID: $FRONTEND_PID)"
    fi
    rm frontend.pid
fi

echo "🎉 Campus Connect stopped successfully!"