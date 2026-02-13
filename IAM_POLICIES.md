# IAM Policies for Score Tracker

This document provides the IAM policies needed for the Score Tracker application.

## Overview

The application requires two separate IAM users with different permission levels:

1. **Admin User** - Full read/write access for the admin panel
2. **Public Read-Only User** - Limited read-only access for the public view

## 1. Admin IAM Policy (Full Access)

This policy grants full DynamoDB access for creating, reading, updating, and deleting data.

### Policy Name: `ScoreTrackerAdminPolicy`

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ScoreTrackerFullAccess",
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:Scan",
                "dynamodb:Query",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:BatchGetItem",
                "dynamodb:BatchWriteItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:*:table/score-tracker-users",
                "arn:aws:dynamodb:us-east-1:*:table/score-tracker-scores"
            ]
        }
    ]
}
```

**Important**: Replace `us-east-1` with your actual AWS region.

### Creating the Admin IAM User

1. Go to AWS IAM Console
2. Click "Users" → "Add users"
3. User name: `score-tracker-admin`
4. Access type: Select "Programmatic access"
5. Set permissions: "Attach existing policies directly"
6. Click "Create policy" and paste the JSON above
7. Name it `ScoreTrackerAdminPolicy`
8. Create the policy and attach it to the user
9. Complete user creation and save the credentials

## 2. Public Read-Only IAM Policy

This policy grants read-only access for the public view. This is safe to use in public-facing code.

### Policy Name: `ScoreTrackerPublicReadOnlyPolicy`

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ScoreTrackerReadOnlyAccess",
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:Scan",
                "dynamodb:Query",
                "dynamodb:BatchGetItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:*:table/score-tracker-users",
                "arn:aws:dynamodb:us-east-1:*:table/score-tracker-scores"
            ]
        }
    ]
}
```

**Important**: Replace `us-east-1` with your actual AWS region.

### Creating the Public Read-Only IAM User

1. Go to AWS IAM Console
2. Click "Users" → "Add users"
3. User name: `score-tracker-public-readonly`
4. Access type: Select "Programmatic access"
5. Set permissions: "Attach existing policies directly"
6. Click "Create policy" and paste the JSON above
7. Name it `ScoreTrackerPublicReadOnlyPolicy`
8. Create the policy and attach it to the user
9. Complete user creation and save the credentials

## Using AWS CLI

### Create Admin Policy and User

```bash
# Create the admin policy
aws iam create-policy \
    --policy-name ScoreTrackerAdminPolicy \
    --policy-document file://admin-policy.json

# Create the admin user
aws iam create-user --user-name score-tracker-admin

# Attach policy to user (replace ACCOUNT_ID with your AWS account ID)
aws iam attach-user-policy \
    --user-name score-tracker-admin \
    --policy-arn arn:aws:iam::ACCOUNT_ID:policy/ScoreTrackerAdminPolicy

# Create access key
aws iam create-access-key --user-name score-tracker-admin
```

### Create Read-Only Policy and User

```bash
# Create the read-only policy
aws iam create-policy \
    --policy-name ScoreTrackerPublicReadOnlyPolicy \
    --policy-document file://readonly-policy.json

# Create the read-only user
aws iam create-user --user-name score-tracker-public-readonly

# Attach policy to user (replace ACCOUNT_ID with your AWS account ID)
aws iam attach-user-policy \
    --user-name score-tracker-public-readonly \
    --policy-arn arn:aws:iam::ACCOUNT_ID:policy/ScoreTrackerPublicReadOnlyPolicy

# Create access key
aws iam create-access-key --user-name score-tracker-public-readonly
```

## Best Practices

### 1. Principle of Least Privilege

- The public user can only read data, never modify it
- The admin user has full access but only to specific tables
- Neither user has access to other AWS resources

### 2. Credential Management

- **Never commit credentials to Git**
- Store admin credentials securely in browser localStorage (accessed only by admins)
- Public credentials can be in source code (they're read-only)
- Rotate credentials every 90 days

### 3. Monitoring

Enable CloudTrail to monitor API calls:

```bash
aws cloudtrail create-trail \
    --name score-tracker-audit \
    --s3-bucket-name my-cloudtrail-bucket
```

### 4. Cost Management

Set up billing alerts for DynamoDB:

1. Go to AWS Billing Dashboard
2. Set up a billing alarm for DynamoDB costs
3. Recommended threshold: $10/month

### 5. Additional Security Measures

#### IP Whitelisting (Optional)

If you want to restrict access by IP, add a condition to the policy:

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
                "arn:aws:dynamodb:us-east-1:*:table/score-tracker-*"
            ],
            "Condition": {
                "IpAddress": {
                    "aws:SourceIp": [
                        "203.0.113.0/24",
                        "198.51.100.0/24"
                    ]
                }
            }
        }
    ]
}
```

#### Time-Based Access (Optional)

Restrict access to certain times:

```json
{
    "Condition": {
        "DateGreaterThan": {"aws:CurrentTime": "2026-01-01T00:00:00Z"},
        "DateLessThan": {"aws:CurrentTime": "2026-12-31T23:59:59Z"}
    }
}
```

## Troubleshooting

### Access Denied Errors

1. **Check policy ARN** - Ensure the table names and region match exactly
2. **Verify user has policy attached** - Use `aws iam list-attached-user-policies`
3. **Check for SCP restrictions** - Organization SCPs may override user policies

### Testing Permissions

Test the read-only user cannot write:

```bash
# This should succeed (read)
aws dynamodb scan --table-name score-tracker-users \
    --profile public-readonly

# This should fail (write)
aws dynamodb put-item --table-name score-tracker-users \
    --item '{"userId":{"S":"test"}}' \
    --profile public-readonly
```

## Security Checklist

- [ ] Created separate admin and read-only IAM users
- [ ] Admin credentials stored securely and not committed to Git
- [ ] Read-only credentials have no write permissions
- [ ] Default admin password changed from `admin123`
- [ ] CloudTrail logging enabled for audit
- [ ] Billing alerts configured
- [ ] Credentials rotation schedule established (90 days)
- [ ] Regular security reviews scheduled

## Support

For issues with IAM policies or AWS configuration:
- AWS Documentation: https://docs.aws.amazon.com/iam/
- AWS Support: https://console.aws.amazon.com/support/
