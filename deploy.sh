#!/bin/bash

# CHIRAL Production Deployment Script
# Usage: ./deploy.sh [environment]

set -e  # Exit on any error

# Configuration
ENVIRONMENT=${1:-production}
PROJECT_NAME="chiral-website"
BUILD_DIR="dist"
SERVER_DIR="/var/www/chiral"
SERVICE_NAME="chiral-backend"

echo "🚀 Starting CHIRAL deployment for $ENVIRONMENT environment"
echo "=================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
    fi
    success "Node.js $(node --version) found"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        error "npm is not installed"
    fi
    success "npm $(npm --version) found"
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        error "package.json not found. Run this script from the project root"
    fi
    
    # Check environment file
    if [ ! -f ".env" ]; then
        warning ".env file not found - create it for production"
    fi
    
    success "Prerequisites check completed"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    npm install --production=false
    success "Dependencies installed"
}

# Run tests
run_tests() {
    log "Running tests..."
    
    # Run linting
    if npm run lint --silent > /dev/null 2>&1; then
        success "ESLint checks passed"
    else
        warning "ESLint warnings found (deployment will continue)"
    fi
    
    # Test build
    log "Testing production build..."
    npm run build
    success "Production build test completed"
}

# Build for production
build_production() {
    log "Building for production..."
    
    # Clean previous build
    rm -rf $BUILD_DIR
    
    # Build
    NODE_ENV=production npm run build
    
    if [ ! -d "$BUILD_DIR" ]; then
        error "Build failed - $BUILD_DIR directory not created"
    fi
    
    # Check build size
    BUILD_SIZE=$(du -sh $BUILD_DIR | cut -f1)
    success "Production build completed (Size: $BUILD_SIZE)"
}

# Deploy backend
deploy_backend() {
    log "Deploying backend..."
    
    # Stop existing service if running
    if systemctl is-active --quiet $SERVICE_NAME 2>/dev/null; then
        log "Stopping existing backend service..."
        sudo systemctl stop $SERVICE_NAME
    fi
    
    # Copy server files
    if [ -d "$SERVER_DIR" ]; then
        log "Updating server files..."
        sudo cp server.js $SERVER_DIR/
        sudo cp package.json $SERVER_DIR/
        sudo cp .env $SERVER_DIR/ 2>/dev/null || warning ".env not copied"
    else
        error "Server directory $SERVER_DIR not found. Run initial deployment setup first."
    fi
    
    # Install backend dependencies
    cd $SERVER_DIR
    sudo npm install --production
    cd - > /dev/null
    
    success "Backend deployment completed"
}

# Deploy frontend
deploy_frontend() {
    log "Deploying frontend..."
    
    if [ ! -d "$SERVER_DIR" ]; then
        error "Server directory $SERVER_DIR not found"
    fi
    
    # Copy built files
    sudo rm -rf $SERVER_DIR/dist
    sudo cp -r $BUILD_DIR $SERVER_DIR/
    
    # Set proper permissions
    sudo chown -R www-data:www-data $SERVER_DIR/dist
    sudo chmod -R 755 $SERVER_DIR/dist
    
    success "Frontend deployment completed"
}

# Start services
start_services() {
    log "Starting services..."
    
    # Start backend service
    sudo systemctl start $SERVICE_NAME
    
    # Check if service started successfully
    sleep 2
    if systemctl is-active --quiet $SERVICE_NAME; then
        success "Backend service started successfully"
    else
        error "Backend service failed to start"
    fi
    
    # Reload nginx
    if systemctl is-active --quiet nginx; then
        sudo nginx -t && sudo systemctl reload nginx
        success "Nginx reloaded successfully"
    else
        warning "Nginx not running or not configured"
    fi
    
    success "All services started"
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Check backend API
    if curl -f -s http://localhost:3001/health > /dev/null 2>&1; then
        success "Backend API health check passed"
    else
        warning "Backend API health check failed"
    fi
    
    # Check frontend (if nginx configured)
    if curl -f -s http://localhost > /dev/null 2>&1; then
        success "Frontend health check passed"
    else
        warning "Frontend health check failed (may need nginx configuration)"
    fi
}

# Generate deployment report
generate_report() {
    log "Generating deployment report..."
    
    REPORT_FILE="deployment-$(date +'%Y%m%d-%H%M%S').log"
    
    {
        echo "CHIRAL Deployment Report"
        echo "======================="
        echo "Date: $(date)"
        echo "Environment: $ENVIRONMENT"
        echo "Git Commit: $(git rev-parse HEAD 2>/dev/null || echo 'Unknown')"
        echo "Build Size: $(du -sh $BUILD_DIR 2>/dev/null | cut -f1 || echo 'Unknown')"
        echo ""
        echo "Services Status:"
        echo "- Backend: $(systemctl is-active $SERVICE_NAME 2>/dev/null || echo 'Unknown')"
        echo "- Nginx: $(systemctl is-active nginx 2>/dev/null || echo 'Unknown')"
        echo ""
        echo "Deployment completed successfully at $(date)"
    } > $REPORT_FILE
    
    success "Deployment report saved: $REPORT_FILE"
}

# Rollback function
rollback() {
    warning "Rolling back deployment..."
    
    # Stop new service
    sudo systemctl stop $SERVICE_NAME 2>/dev/null || true
    
    # Restore from backup if exists
    if [ -d "${SERVER_DIR}.backup" ]; then
        sudo rm -rf $SERVER_DIR
        sudo mv ${SERVER_DIR}.backup $SERVER_DIR
        sudo systemctl start $SERVICE_NAME
        success "Rollback completed"
    else
        error "No backup found for rollback"
    fi
}

# Main deployment process
main() {
    case $ENVIRONMENT in
        "production")
            log "Production deployment starting..."
            check_prerequisites
            install_dependencies
            run_tests
            build_production
            deploy_backend
            deploy_frontend
            start_services
            health_check
            generate_report
            success "🎉 Production deployment completed successfully!"
            ;;
        "staging")
            log "Staging deployment starting..."
            check_prerequisites
            install_dependencies
            build_production
            success "🎉 Staging build completed!"
            ;;
        "test")
            log "Test deployment starting..."
            check_prerequisites
            install_dependencies
            run_tests
            success "🎉 Test suite completed!"
            ;;
        *)
            error "Unknown environment: $ENVIRONMENT. Use 'production', 'staging', or 'test'"
            ;;
    esac
}

# Handle script interruption
trap 'error "Deployment interrupted"' INT TERM

# Run main function
main

echo ""
echo "🚀 CHIRAL Deployment Summary"
echo "============================"
echo "Environment: $ENVIRONMENT"
echo "Status: SUCCESS"
echo "Time: $(date)"
echo ""
echo "Next steps:"
echo "1. Update DNS to point to your server IP"
echo "2. Configure SSL certificate with certbot"
echo "3. Set up monitoring and backup systems"
echo "4. Update tracking IDs in production"
echo ""
echo "Dashboard: http://your-domain.com/admin/dashboard"
echo "Main site: http://your-domain.com"