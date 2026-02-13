# Public View Configuration Guide

This guide explains how to set up the public view with read-only access to your DynamoDB tables.

## Overview

The Score Tracker application now has two main views:
1. **Public View** (`public.html`) - Read-only access showing player statistics
2. **Admin Panel** (`admin.html`) - Full access for administrators with edit capabilities

## Setting Up Read-Only IAM User for Public View

To enable the public view, you need to create a separate IAM user with read-only permissions:

### 1. Create Read-Only IAM Policy

Create a new IAM policy with the following JSON:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:Scan",
                "dynamodb:Query"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:*:table/score-tracker-users",
                "arn:aws:dynamodb:us-east-1:*:table/score-tracker-scores"
            ]
        }
    ]
}
```

**Note**: Replace `us-east-1` with your actual AWS region.

### 2. Create Read-Only IAM User

1. Go to AWS IAM Console
2. Create a new user (e.g., `score-tracker-public-readonly`)
3. Select "Programmatic access"
4. Attach the read-only policy created in step 1
5. Save the Access Key ID and Secret Access Key

### 3. Configure Public View

You have two options to configure the public view:

#### Option A: Using Browser Console (Recommended for Testing)

1. Open `public.html` in your browser
2. Open browser developer console (F12)
3. Run the following JavaScript:

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

4. Refresh the page

#### Option B: Modify public.js (For Permanent Deployment)

For a production deployment, you can hardcode the read-only credentials directly in `public.js`:

```javascript
let config = {
    region: 'us-east-1',
    accessKeyId: 'YOUR_READONLY_ACCESS_KEY',
    secretAccessKey: 'YOUR_READONLY_SECRET_KEY',
    usersTable: 'score-tracker-users',
    scoresTable: 'score-tracker-scores'
};
```

**Security Note**: Read-only credentials in the public view are visible to anyone who views the page source. This is acceptable if:
- The credentials only have read access to DynamoDB
- The data shown is intended to be public
- You're comfortable with anyone being able to read this data

## Setting Up Admin Access

### 1. Admin Password

The default admin password is `admin123`. To change it:

1. Log in to the admin panel with the default password
2. Go to AWS Configuration section
3. Enter your new password in the "Admin Password" field
4. Click "Save Configuration"

### 2. Admin AWS Credentials

The admin panel requires AWS credentials with full DynamoDB permissions (read and write):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:Scan",
                "dynamodb:Query",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:*:table/score-tracker-users",
                "arn:aws:dynamodb:us-east-1:*:table/score-tracker-scores"
            ]
        }
    ]
}
```

## Security Best Practices

1. **Never commit credentials to Git** - Always use environment-specific configuration
2. **Use separate IAM users** - One for public (read-only) and one for admin (full access)
3. **Rotate credentials regularly** - Change AWS credentials periodically
4. **Strong admin password** - Use a strong, unique password for admin access
5. **HTTPS only** - Ensure GitHub Pages is served over HTTPS (default for GitHub Pages)

## Alternative: API Gateway + Lambda (Recommended for Production)

For better security in production, consider:

1. **AWS API Gateway** - Create REST API endpoints
2. **AWS Lambda** - Functions to handle DynamoDB operations
3. **AWS Cognito** - User authentication and authorization
4. **No client-side credentials** - All AWS operations happen server-side

This approach eliminates the need to expose any AWS credentials in the frontend.

## Troubleshooting

### Public view shows "Public view not configured"

- Ensure you've set the `publicAwsConfig` in localStorage or hardcoded credentials in `public.js`
- Check browser console for errors
- Verify read-only IAM credentials are correct

### Admin panel redirects to login after refresh

- This is normal behavior - sessions expire after 24 hours
- Log in again with your admin password

### "Access Denied" errors in public view

- Verify the IAM policy includes `GetItem`, `Scan`, and `Query` actions
- Ensure the policy resource ARN matches your table names and region
- Check that the credentials are from the read-only IAM user

## Testing

1. **Test Public View**:
   - Open `public.html`
   - Should see player statistics without needing to log in
   - Should not have any edit capabilities

2. **Test Admin Panel**:
   - Go to main page (index.html)
   - Log in with admin password
   - Should be redirected to admin.html
   - Should be able to add users and scores

3. **Test Security**:
   - Try accessing admin.html directly without logging in
   - Should be redirected to login page
   - After logging out, should not be able to access admin panel
