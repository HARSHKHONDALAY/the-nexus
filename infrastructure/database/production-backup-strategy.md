# Production Database Backup & Recovery Strategy

## Overview
This document outlines the production-grade backup and recovery strategy for The Nexus database on AWS Lightsail.

## Backup Configuration

### Automated Backups
- **Frequency**: Daily automated backups at 2:00 AM UTC
- **Retention**: 30 days of daily backups + 12 weeks of weekly backups
- **Storage**: AWS Lightsail automated snapshots + S3 backup storage
- **Encryption**: AES-256 encryption at rest and in transit

### Manual Backup Commands
```bash
# Pre-deployment backup
pg_dump -h DATABASE_HOST -U DATABASE_USER -d DATABASE_NAME \
  --format=custom --compress=9 --file=pre-deployment-$(date +%Y%m%d_%H%M%S).backup

# Schema-only backup
pg_dump -h DATABASE_HOST -U DATABASE_USER -d DATABASE_NAME \
  --schema-only --file=schema-$(date +%Y%m%d_%H%M%S).sql

# Data-only backup
pg_dump -h DATABASE_HOST -U DATABASE_USER -d DATABASE_NAME \
  --data-only --file=data-$(date +%Y%m%d_%H%M%S).sql
```

## Recovery Procedures

### Emergency Recovery Steps
1. **Assess the damage**: Identify what needs to be restored
2. **Take immediate backup**: Backup current state before restoration
3. **Choose recovery point**: Select appropriate backup from retention
4. **Execute restoration**: Use appropriate recovery method
5. **Verify integrity**: Run post-restoration validation
6. **Update applications**: Restart services with restored database

### Restoration Commands
```bash
# Full database restoration
pg_restore -h DATABASE_HOST -U DATABASE_USER -d DATABASE_NAME \
  --clean --if-exists --verbose backup-file.backup

# Point-in-time recovery (if WAL archiving enabled)
pg_basebackup -h DATABASE_HOST -U DATABASE_USER -D /tmp/base_backup \
  --verbose --progress --waldir=/tmp/wal_archive
```

## Rollback Strategy

### Migration Rollback
- **Flyway rollback**: Use Flyway's built-in rollback capabilities
- **Manual rollback**: SQL scripts for critical migrations
- **Data preservation**: Export affected data before rollback

### Application Rollback
- **Blue-green deployment**: Maintain previous version for quick rollback
- **Feature flags**: Disable problematic features without full rollback
- **Database compatibility**: Ensure backward compatibility

## Monitoring & Alerting

### Backup Monitoring
- **Success alerts**: Daily backup completion notifications
- **Failure alerts**: Immediate notification of backup failures
- **Storage monitoring**: Alert when backup storage exceeds 80% capacity

### Database Health Monitoring
- **Connection monitoring**: Alert on connection pool exhaustion
- **Performance metrics**: Monitor query performance and slow queries
- **Error rates**: Alert on increased database error rates

## Disaster Recovery

### RTO/RPO Targets
- **Recovery Time Objective (RTO)**: 4 hours maximum
- **Recovery Point Objective (RPO)**: 1 hour maximum data loss

### Multi-Region Strategy
- **Primary region**: ap-south-1 (Mumbai)
- **Backup region**: Cross-region replication to ap-southeast-1
- **Failover procedure**: Manual failover with 2-hour target

## Testing Procedures

### Monthly Backup Testing
- **Restore verification**: Test restore to non-production environment
- **Data integrity**: Verify restored data matches production
- **Application testing**: Test application functionality with restored data

### Quarterly Disaster Recovery Drill
- **Full failover test**: Simulate complete primary region failure
- **Performance testing**: Verify performance under failover conditions
- **Documentation update**: Update procedures based on test results

## Contact Information
- **Primary DBA**: [Contact information]
- **Secondary DBA**: [Contact information]
- **AWS Support**: [AWS support contact]
- **Emergency escalation**: [Emergency contact procedure]

## Checklist

### Pre-Deployment Checklist
- [ ] Current backup completed and verified
- [ ] Migration rollback scripts tested
- [ ] Database performance baselines recorded
- [ ] Monitoring alerts configured
- [ ] Recovery team notified

### Post-Deployment Checklist
- [ ] Database performance verified
- [ ] Application functionality tested
- [ ] Backup of new state completed
- [ ] Monitoring baselines updated
- [ ] Documentation updated
