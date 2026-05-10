#!/bin/bash

# Production startup script for The Nexus backend on AWS Lightsail
# This script ensures proper startup sequence and error handling

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check required environment variables
check_env_vars() {
    log "Checking required environment variables..."
    
    required_vars=(
        "DATABASE_URL"
        "DATABASE_USERNAME"
        "DATABASE_PASSWORD"
        "JWT_SECRET"
        "CORS_ALLOWED_ORIGINS"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            error "Required environment variable $var is not set"
        fi
    done
    
    # Validate JWT secret length
    if [ ${#JWT_SECRET} -lt 32 ]; then
        error "JWT_SECRET must be at least 32 characters"
    fi
    
    log "Environment variables validated"
}

# Check database connectivity
check_database() {
    log "Checking database connectivity..."
    
    # Extract database details from DATABASE_URL
    if [[ $DATABASE_URL =~ postgresql://(.+):(.+)@(.+):(.+)/(.+) ]]; then
        db_user="${BASH_REMATCH[1]}"
        db_pass="${BASH_REMATCH[2]}"
        db_host="${BASH_REMATCH[3]}"
        db_port="${BASH_REMATCH[4]}"
        db_name="${BASH_REMATCH[5]}"
        
        # Test database connection
        PGPASSWORD="$db_pass" psql -h "$db_host" -p "$db_port" -U "$db_user" -d "$db_name" -c "SELECT 1;" > /dev/null 2>&1 || {
            error "Database connection failed"
        }
        
        log "Database connectivity verified"
    else
        error "Invalid DATABASE_URL format"
    fi
}

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."
    
    mkdir -p /var/log/nexus-backend
    mkdir -p /tmp/nexus-backend
    
    log "Directories created"
}

# Set proper permissions
set_permissions() {
    log "Setting proper permissions..."
    
    chmod +x /opt/nexus/backend/*.jar
    chown -R nexus:nexus /var/log/nexus-backend
    chown -R nexus:nexus /tmp/nexus-backend
    
    log "Permissions set"
}

# Start the application
start_application() {
    log "Starting The Nexus backend..."
    
    # Set JVM options for production
    export JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:+UseStringDeduplication -XX:+OptimizeStringConcat -Djava.security.egd=file:/dev/./urandom"
    
    # Set Spring profile
    export SPRING_PROFILES_ACTIVE=prod
    
    # Start the application
    cd /opt/nexus/backend
    exec java $JAVA_OPTS -jar nexus-backend.jar
}

# Main execution
main() {
    log "Starting The Nexus backend production startup..."
    
    check_env_vars
    check_database
    create_directories
    set_permissions
    start_application
}

# Handle signals gracefully
trap 'log "Received shutdown signal, exiting gracefully..."; exit 0' SIGTERM SIGINT

# Run main function
main "$@"
