# Quick Start Guide - Score Tracker Remote Access

This guide helps you get started with the new secure remote access features.

## Overview

The Score Tracker now has two access modes:
- **Public View** - Anyone can view player statistics (read-only)
- **Admin Panel** - Password-protected access for managing users and scores

## First Time Setup

### Step 1: Access the Application

Visit your GitHub Pages URL: `https://tejamakkena.github.io/score_tracker/`

You'll see the login page with two options:
1. Admin Login (for full access)
2. Public View (for viewing statistics only)

### Step 2: Admin First Login

1. Click "Admin Login" or enter password in the field
2. Use default password: `admin123`
3. You'll see a warning to change this password - do this immediately!

### Step 3: Configure AWS Credentials (Admin Only)

After logging in to the admin panel:

1. Scroll to **AWS Configuration** section
2. Enter your AWS credentials:
   - AWS Region: `us-east-1` (or your region)
   - Access Key ID: From your admin IAM user
   - Secret Access Key: From your admin IAM user
   - Table names: Default values should work

3. **IMPORTANT**: Set a strong admin password in the "Admin Password" field
4. Click "Save Configuration"

### Step 4: Configure Public View (Optional)

If you want to enable the public view:

1. Create a read-only IAM user (see `IAM_POLICIES.md`)
2. Configure public credentials using one of these methods:
   
   **Method A - Browser Console** (Recommended for testing):
   ```javascript
   const publicConfig = {
       region: 'us-east-1',
       accessKeyId: 'YOUR_READONLY_ACCESS_KEY',
       secretAccessKey: 'YOUR_READONLY_SECRET_KEY',
       usersTable: 'score-tracker-users',
       scoresTable: 'score-tracker-scores'
   };
   localStorage.setItem('publicAwsConfig', JSON.stringify(publicConfig));
   ```

   **Method B - Edit public.js** (For permanent deployment):
   Edit the config object in `public.js` lines 5-10

## Daily Usage

### For Admins

1. Visit the main page: `https://tejamakkena.github.io/score_tracker/`
2. Enter your admin password
3. Manage users, add scores, view reports
4. Click "Logout" when done

**Note**: Your AWS configuration is saved and you won't need to re-enter it after logout.

### For Public Users

1. Visit: `https://tejamakkena.github.io/score_tracker/public.html`
2. Or click "Public View" from the login page
3. View player statistics - no login needed

## Common Tasks

### Change Admin Password

1. Log in to admin panel
2. Go to AWS Configuration section
3. Enter new password in "Admin Password" field
4. Click "Save Configuration"

### Add a New User

1. Log in to admin panel
2. Go to "User Management" section
3. Enter user name and optional email
4. Click "Add User"

### Record a Score

1. Log in to admin panel
2. Go to "Enter Score" section
3. Select user from dropdown
4. Fill in game details
5. Click "Submit Score"

### View Statistics

**Admin**: Full score history table in admin panel
**Public**: Aggregated statistics per player in public view

## Troubleshooting

### Can't Log In

- Default password is `admin123` (must be changed)
- Check that you're using the password you set in AWS Configuration
- Try clearing browser cache and localStorage

### Public View Shows Error

- Ensure you've configured public credentials (see Step 4 above)
- Check that read-only IAM user has correct permissions
- See `PUBLIC_VIEW_SETUP.md` for detailed troubleshooting

### AWS Configuration Not Saved

- Check browser console for errors
- Ensure all required fields are filled
- Try a different browser if issues persist

### Access Denied Errors

- Verify IAM user has correct permissions
- Check table names match exactly
- Ensure region is correct
- See `IAM_POLICIES.md` for correct policy configuration

## Security Tips

### ✅ DO:
- Change the default password immediately
- Use strong, unique passwords
- Rotate AWS credentials every 90 days
- Use separate IAM users for admin and public access
- Log out when done

### ❌ DON'T:
- Share your admin password
- Commit AWS credentials to Git
- Use the same password for multiple accounts
- Give admin credentials to untrusted users

## Getting Help

### Documentation Files
- `README.md` - General overview and features
- `PUBLIC_VIEW_SETUP.md` - Detailed public view configuration
- `IAM_POLICIES.md` - AWS IAM policy setup
- `DYNAMODB_SETUP.md` - Database table setup

### Common Error Messages

**"Please configure AWS settings first"**
- Solution: Enter AWS credentials in admin panel

**"Public view not configured"**
- Solution: Configure read-only credentials (see Step 4)

**"Invalid password"**
- Solution: Check your admin password or use default `admin123`

**"Access Denied"**
- Solution: Verify IAM permissions in AWS Console

## Next Steps

After initial setup:
1. ✅ Changed default password
2. ✅ Configured AWS credentials
3. ✅ Added first user
4. ✅ Recorded first score
5. ✅ Tested public view

You're all set! 🎉

## Support

For issues or questions:
- Check the documentation in this repository
- Review AWS IAM policies for permission issues
- Check browser console for JavaScript errors
- Verify DynamoDB tables exist and are accessible

---

**Version**: 1.0  
**Last Updated**: 2026-02-13
