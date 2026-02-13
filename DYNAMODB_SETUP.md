# DynamoDB Table Setup Guide

This guide explains how to set up the required DynamoDB tables for the Score Tracker application.

## Required Tables

### 1. Users Table (`score-tracker-users`)

**Primary Key:**
- Partition Key: `userId` (String)

**Attributes:**
- `userId`: Unique identifier for the user
- `userName`: Name of the user
- `email`: Email address (optional)
- `createdAt`: Timestamp when the user was created
- `updatedAt`: Timestamp when the user was last updated

**AWS CLI Command to Create:**
```bash
aws dynamodb create-table \
    --table-name score-tracker-users \
    --attribute-definitions AttributeName=userId,AttributeType=S \
    --key-schema AttributeName=userId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

### 2. Scores Table (`score-tracker-scores`)

**Primary Key:**
- Partition Key: `scoreId` (String)

**Attributes:**
- `scoreId`: Unique identifier for the score entry
- `userId`: Reference to the user
- `userName`: Name of the user (denormalized for display)
- `gameName`: Name of the game
- `score`: Numeric score value
- `amountWon`: Amount won in the game (decimal)
- `gameDate`: Date when the game was played (YYYY-MM-DD format)
- `createdAt`: Timestamp when the score was recorded
- `updatedAt`: Timestamp when the score was last updated

**AWS CLI Command to Create:**
```bash
aws dynamodb create-table \
    --table-name score-tracker-scores \
    --attribute-definitions AttributeName=scoreId,AttributeType=S \
    --key-schema AttributeName=scoreId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

## Setup via AWS Console

### For Users Table:
1. Go to AWS DynamoDB Console
2. Click "Create table"
3. Table name: `score-tracker-users`
4. Partition key: `userId` (String)
5. Table settings: Use default settings or choose "On-demand" for billing mode
6. Click "Create table"

### For Scores Table:
1. Go to AWS DynamoDB Console
2. Click "Create table"
3. Table name: `score-tracker-scores`
4. Partition key: `scoreId` (String)
5. Table settings: Use default settings or choose "On-demand" for billing mode
6. Click "Create table"

## IAM Permissions

The IAM user whose credentials you use in the application needs the following permissions:

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

## Security Notes

- Never commit AWS credentials to your repository
- The application stores credentials in browser localStorage only
- Credentials are only sent directly to AWS services
- Consider using AWS Cognito for production applications
- For better security, use temporary credentials or AWS Amplify

## Cost Considerations

Using PAY_PER_REQUEST (On-Demand) billing mode is recommended for:
- Applications with unpredictable workloads
- New applications with unknown traffic patterns
- Development and testing environments

For consistent, predictable workloads, consider switching to PROVISIONED billing mode to potentially reduce costs.
