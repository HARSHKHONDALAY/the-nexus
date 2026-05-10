#!/bin/bash

# Production Deployment Validation Script
# Validates that The Nexus is ready for production deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validation results
VALIDATION_PASSED=true
FAILED_CHECKS=()

# Check 1: Environment variables
validate_environment() {
    log_info "Validating environment variables..."
    
    required_vars=(
        "NEXT_PUBLIC_API_URL"
        "NEXT_PUBLIC_ENVIRONMENT"
        "DATABASE_URL"
        "NEXTAUTH_SECRET"
        "STRIPE_SECRET_KEY"
        "AWS_ACCESS_KEY_ID"
        "AWS_SECRET_ACCESS_KEY"
    )
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            log_error "Missing required environment variable: $var"
            FAILED_CHECKS+=("Environment Variable: $var")
            VALIDATION_PASSED=false
        else
            log_success "Environment variable $var is set"
        fi
    done
}

# Check 2: Frontend build
validate_frontend_build() {
    log_info "Validating frontend build..."
    
    # Clean previous build
    rm -rf .next
    
    # Build frontend
    if pnpm build; then
        log_success "Frontend build completed successfully"
        
        # Check build size
        BUILD_SIZE=$(du -sh .next | cut -f1)
        log_info "Build size: $BUILD_SIZE"
        
        # Validate build output
        if [[ -f ".next/server.js" ]]; then
            log_success "Server bundle found"
        else
            log_error "Server bundle missing"
            FAILED_CHECKS+=("Frontend Server Bundle")
            VALIDATION_PASSED=false
        fi
        
        if [[ -d ".next/static" ]]; then
            log_success "Static assets found"
        else
            log_error "Static assets missing"
            FAILED_CHECKS+=("Frontend Static Assets")
            VALIDATION_PASSED=false
        fi
    else
        log_error "Frontend build failed"
        FAILED_CHECKS+=("Frontend Build")
        VALIDATION_PASSED=false
    fi
}

# Check 3: Backend build
validate_backend_build() {
    log_info "Validating backend build..."
    
    cd backend
    
    # Clean previous build
    mvn clean
    
    # Build backend
    if mvn package -DskipTests; then
        log_success "Backend build completed successfully"
        
        # Check JAR file
        JAR_FILE=$(find target -name "*.jar" -not -name "*-sources.jar" | head -1)
        if [[ -f "$JAR_FILE" ]]; then
            log_success "JAR file found: $JAR_FILE"
            
            # Check JAR size
            JAR_SIZE=$(du -sh "$JAR_FILE" | cut -f1)
            log_info "JAR size: $JAR_SIZE"
        else
            log_error "JAR file not found"
            FAILED_CHECKS+=("Backend JAR")
            VALIDATION_PASSED=false
        fi
    else
        log_error "Backend build failed"
        FAILED_CHECKS+=("Backend Build")
        VALIDATION_PASSED=false
    fi
    
    cd ..
}

# Check 4: Database connectivity
validate_database() {
    log_info "Validating database connectivity..."
    
    # Test database connection
    if pnpm db:push --accept-data-loss 2>/dev/null; then
        log_success "Database connection successful"
    else
        log_error "Database connection failed"
        FAILED_CHECKS+=("Database Connection")
        VALIDATION_PASSED=false
    fi
    
    # Run migrations
    if pnpm db:migrate; then
        log_success "Database migrations completed"
    else
        log_error "Database migrations failed"
        FAILED_CHECKS+=("Database Migrations")
        VALIDATION_PASSED=false
    fi
}

# Check 5: Security configurations
validate_security() {
    log_info "Validating security configurations..."
    
    # Check for hardcoded secrets
    if grep -r "password\|secret\|key" --include="*.ts" --include="*.js" --include="*.json" src/ | grep -v "node_modules" | grep -v "NEXT_PUBLIC_" > /dev/null 2>&1; then
        log_error "Potential hardcoded secrets found"
        FAILED_CHECKS+=("Security: Hardcoded Secrets")
        VALIDATION_PASSED=false
    else
        log_success "No hardcoded secrets detected"
    fi
    
    # Check HTTPS configuration
    if [[ "$NEXT_PUBLIC_API_URL" =~ ^https:// ]]; then
        log_success "HTTPS API URL configured"
    else
        log_error "API URL is not HTTPS"
        FAILED_CHECKS+=("Security: HTTPS")
        VALIDATION_PASSED=false
    fi
}

# Check 6: Performance optimizations
validate_performance() {
    log_info "Validating performance optimizations..."
    
    # Check for optimized images
    if [[ -d "src/assets" ]]; then
        LARGE_IMAGES=$(find src/assets -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | xargs -I {} du -h {} | awk '$1 ~ /M/ && $1 > "10M"')
        if [[ -z "$LARGE_IMAGES" ]]; then
            log_success "No oversized images found"
        else
            log_warning "Large images found:"
            echo "$LARGE_IMAGES"
        fi
    fi
    
    # Check bundle size
    if [[ -f ".next/server.js" ]]; then
        BUNDLE_SIZE=$(stat -f%z .next/server.js 2>/dev/null || stat -c%s .next/server.js 2>/dev/null)
        BUNDLE_SIZE_MB=$((BUNDLE_SIZE / 1024 / 1024))
        
        if [[ $BUNDLE_SIZE_MB -lt 50 ]]; then
            log_success "Server bundle size is acceptable (${BUNDLE_SIZE_MB}MB)"
        else
            log_warning "Large server bundle (${BUNDLE_SIZE_MB}MB)"
        fi
    fi
}

# Check 7: Docker images
validate_docker() {
    log_info "Validating Docker configuration..."
    
    # Test frontend Docker build
    if docker build -f Dockerfile.frontend -t thenexus-frontend:test .; then
        log_success "Frontend Docker image built successfully"
        docker rmi thenexus-frontend:test
    else
        log_error "Frontend Docker build failed"
        FAILED_CHECKS+=("Docker Frontend")
        VALIDATION_PASSED=false
    fi
    
    # Test backend Docker build
    if docker build -f Dockerfile.backend -t thenexus-backend:test ./backend; then
        log_success "Backend Docker image built successfully"
        docker rmi thenexus-backend:test
    else
        log_error "Backend Docker build failed"
        FAILED_CHECKS+=("Docker Backend")
        VALIDATION_PASSED=false
    fi
}

# Check 8: Dependencies
validate_dependencies() {
    log_info "Validating dependencies..."
    
    # Check for known vulnerabilities
    if pnpm audit --audit-level moderate; then
        log_success "No high-severity vulnerabilities found"
    else
        log_warning "Security vulnerabilities detected"
        FAILED_CHECKS+=("Dependencies: Vulnerabilities")
        VALIDATION_PASSED=false
    fi
    
    # Check for outdated packages
    OUTDATED=$(pnpm outdated --json | jq -r '. | length')
    if [[ $OUTDATED -eq 0 ]]; then
        log_success "All dependencies are up to date"
    else
        log_warning "$OUTDATED outdated packages found"
    fi
}

# Check 9: Production readiness
validate_production_readiness() {
    log_info "Validating production readiness..."
    
    # Check environment
    if [[ "$NEXT_PUBLIC_ENVIRONMENT" == "production" ]]; then
        log_success "Production environment configured"
    else
        log_warning "Not in production environment (current: $NEXT_PUBLIC_ENVIRONMENT)"
    fi
    
    # Check for development tools
    if [[ -f "next.config.js" ]] && grep -q "dev" next.config.js; then
        log_warning "Development configurations found in production"
        FAILED_CHECKS+=("Production: Dev Config")
        VALIDATION_PASSED=false
    fi
    
    # Check analytics and monitoring
    if [[ -n "$NEXT_PUBLIC_LOG_ENDPOINT" ]]; then
        log_success "Logging endpoint configured"
    else
        log_warning "No logging endpoint configured"
    fi
}

# Check 10: Asset optimization
validate_assets() {
    log_info "Validating asset optimization..."
    
    # Check for WebP support
    if grep -q "image/webp" next.config.ts; then
        log_success "WebP optimization enabled"
    else
        log_warning "WebP optimization not configured"
    fi
    
    # Check for AVIF support
    if grep -q "image/avif" next.config.ts; then
        log_success "AVIF optimization enabled"
    else
        log_warning "AVIF optimization not configured"
    fi
    
    # Check for compression
    if grep -q "compress: true" next.config.ts; then
        log_success "Compression enabled"
    else
        log_warning "Compression not configured"
    fi
}

# Main validation function
main() {
    echo "=========================================="
    echo "The Nexus - Production Deployment Validation"
    echo "=========================================="
    echo ""
    
    validate_environment
    validate_frontend_build
    validate_backend_build
    validate_database
    validate_security
    validate_performance
    validate_docker
    validate_dependencies
    validate_production_readiness
    validate_assets
    
    echo ""
    echo "=========================================="
    echo "Validation Results"
    echo "=========================================="
    
    if $VALIDATION_PASSED; then
        log_success "All validation checks passed! ✅"
        echo ""
        echo "The Nexus is ready for production deployment."
        exit 0
    else
        log_error "Validation failed! ❌"
        echo ""
        echo "Failed checks:"
        for check in "${FAILED_CHECKS[@]}"; do
            echo "  ❌ $check"
        done
        echo ""
        echo "Please address these issues before deploying to production."
        exit 1
    fi
}

# Run validation
main "$@"
