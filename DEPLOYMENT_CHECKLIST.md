# Deployment Checklist

Use this checklist when deploying the Score Tracker application with remote access features.

## Pre-Deployment

### AWS Setup
- [ ] DynamoDB tables created:
  - [ ] `score-tracker-users` table with `userId` partition key
  - [ ] `score-tracker-scores` table with `scoreId` partition key
- [ ] IAM users created:
  - [ ] Admin IAM user with full DynamoDB permissions
  - [ ] Public read-only IAM user with limited permissions
- [ ] IAM policies attached:
  - [ ] `ScoreTrackerAdminPolicy` attached to admin user
  - [ ] `ScoreTrackerPublicReadOnlyPolicy` attached to public user
- [ ] Access keys generated for both users
- [ ] Credentials securely stored (not in repository)

### GitHub Pages
- [ ] GitHub Pages enabled in repository settings
- [ ] Source branch configured (usually `main` or `master`)
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enforced

## Initial Deployment

### Code Verification
- [ ] All files committed to repository
- [ ] No AWS credentials in committed code
- [ ] `.gitignore` properly configured
- [ ] Repository pushed to GitHub

### Testing
- [ ] GitHub Pages site is accessible
- [ ] Main page (index.html) loads correctly
- [ ] Public view (public.html) loads correctly
- [ ] Admin panel (admin.html) requires authentication

## Post-Deployment Configuration

### Admin Setup
- [ ] Access the deployed site
- [ ] Log in with default password (`admin123`)
- [ ] Navigate to AWS Configuration section
- [ ] Enter admin AWS credentials
- [ ] Set a strong admin password (replace default)
- [ ] Save configuration
- [ ] Test logout and re-login with new password

### Public View Setup (Optional)
- [ ] Decision made on public view:
  - [ ] Keep disabled (no public credentials configured)
  - [ ] Enable public view (configure read-only credentials)
- [ ] If enabling public view:
  - [ ] Configure using browser console method (temporary), OR
  - [ ] Edit `public.js` with read-only credentials (permanent)
  - [ ] Test public view loads data correctly

### Functionality Testing
- [ ] Add a test user through admin panel
- [ ] Record a test score
- [ ] View score history in admin panel
- [ ] Test filtering by user
- [ ] Verify summary statistics display correctly
- [ ] If public view enabled, verify it shows correct data
- [ ] Test all navigation links work
- [ ] Test logout functionality

## Security Verification

### Authentication
- [ ] Default password changed to strong password
- [ ] Cannot access admin.html without logging in
- [ ] Login required after 24 hours (session expiry)
- [ ] Logout clears session but preserves AWS config

### AWS Permissions
- [ ] Admin credentials have full access
- [ ] Public credentials (if used) are read-only
- [ ] Test public credentials cannot write to DynamoDB
- [ ] No credentials visible in browser console warnings

### Documentation Review
- [ ] All documentation files present and accurate
- [ ] README.md reflects current setup
- [ ] Setup guides tested and verified
- [ ] Contact information updated if needed

## Monitoring Setup (Recommended)

### AWS CloudWatch
- [ ] CloudWatch logs enabled for DynamoDB
- [ ] Alarms set for unusual activity
- [ ] Cost alerts configured

### AWS CloudTrail
- [ ] CloudTrail enabled for API logging
- [ ] Audit logs stored in S3 bucket
- [ ] Log retention policy configured

### Billing
- [ ] Billing alerts configured
- [ ] Budget set for monthly costs
- [ ] Cost Explorer reviewed

## Maintenance Schedule

### Weekly
- [ ] Review DynamoDB read/write capacity
- [ ] Check for any error logs
- [ ] Verify backups are working (if configured)

### Monthly
- [ ] Review AWS costs
- [ ] Check for security advisories
- [ ] Test full application functionality

### Quarterly
- [ ] Rotate AWS credentials
- [ ] Review and update IAM policies
- [ ] Security audit
- [ ] Update documentation if needed

## Rollback Plan

If issues occur after deployment:

1. **Critical Issues** (site down, security breach):
   - [ ] Immediately disable GitHub Pages
   - [ ] Rotate AWS credentials
   - [ ] Investigate issue in local environment
   - [ ] Fix and re-deploy

2. **Non-Critical Issues** (minor bugs, UI issues):
   - [ ] Document the issue
   - [ ] Test fix in local environment
   - [ ] Deploy fix
   - [ ] Verify fix in production

3. **Rollback to Previous Version**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

## Troubleshooting Common Issues

### Site Not Loading
- Check GitHub Pages settings
- Verify repository is public (or Pages enabled for private repo)
- Check browser console for errors
- Clear browser cache

### Authentication Not Working
- Verify default password if first login
- Check browser localStorage is enabled
- Try different browser
- Clear localStorage and reconfigure

### AWS Access Errors
- Verify IAM credentials are correct
- Check IAM policy permissions
- Verify table names match exactly
- Confirm region is correct

### Public View Not Working
- Check if public credentials are configured
- Verify read-only IAM user has correct permissions
- Check browser console for errors
- Test credentials using AWS CLI

## Support Contacts

- **Repository Owner**: [Add contact info]
- **AWS Support**: https://console.aws.amazon.com/support/
- **GitHub Pages Status**: https://www.githubstatus.com/

## Notes

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Admin Password Changed**: _______________  
**Public View Enabled**: [ ] Yes [ ] No  
**Custom Domain**: _______________  

---

**Last Updated**: 2026-02-13  
**Version**: 1.0
