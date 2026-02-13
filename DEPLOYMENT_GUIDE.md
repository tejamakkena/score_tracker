# 🚀 Quick Deployment Guide

This guide will help you deploy Score Tracker so it's accessible from anywhere, with a one-time AWS setup.

## ✨ New Features

- **🎮 Futuristic Gaming UI** - Modern design with neon colors and animations
- **⚡ Setup Wizard** - One-time configuration for AWS credentials
- **📱 Mobile Responsive** - Access from any phone or device
- **🔐 Secure Authentication** - Password-protected admin access
- **👥 Public View** - Optional read-only access for non-admin users

## 📋 Prerequisites

Before you begin, make sure you have:

- [ ] A GitHub account
- [ ] An AWS account
- [ ] Basic understanding of Git and GitHub

## 🎯 Deployment Steps

### Step 1: Fork or Clone Repository

1. **Fork this repository** to your own GitHub account
   - Click the "Fork" button at the top right of this page
   - Or clone it: `git clone https://github.com/tejamakkena/score_tracker.git`

### Step 2: Enable GitHub Pages

1. Go to your repository **Settings**
2. Scroll down to **Pages** section
3. Under **Source**, select your main branch
4. Click **Save**
5. Your site will be published at: `https://YOUR-USERNAME.github.io/score_tracker/`

**That's it!** Your Score Tracker is now accessible from anywhere! 🎉

### Step 3: Set Up AWS DynamoDB (One-Time)

#### 3.1 Create DynamoDB Tables

**Option A: Using AWS Console**

1. Go to [AWS DynamoDB Console](https://console.aws.amazon.com/dynamodb/)
2. Click **Create table**

**Users Table:**
- Table name: `score-tracker-users`
- Partition key: `userId` (String)
- Settings: On-demand billing mode
- Click **Create table**

**Scores Table:**
- Table name: `score-tracker-scores`
- Partition key: `scoreId` (String)
- Settings: On-demand billing mode
- Click **Create table**

**Option B: Using AWS CLI** (faster)

```bash
# Create Users Table
aws dynamodb create-table \
    --table-name score-tracker-users \
    --attribute-definitions AttributeName=userId,AttributeType=S \
    --key-schema AttributeName=userId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1

# Create Scores Table
aws dynamodb create-table \
    --table-name score-tracker-scores \
    --attribute-definitions AttributeName=scoreId,AttributeType=S \
    --key-schema AttributeName=scoreId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

#### 3.2 Create IAM User for Admin Access

1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Add users**
3. User name: `score-tracker-admin`
4. Access type: **Programmatic access**
5. Click **Next: Permissions**
6. Click **Attach existing policies directly**
7. Click **Create policy** and use this JSON:

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

8. Name it `ScoreTrackerAdminPolicy`
9. Attach it to your user
10. **Save your Access Key ID and Secret Access Key** - you'll need these!

#### 3.3 (Optional) Create IAM User for Public Read-Only Access

If you want to enable public viewing:

1. Create another IAM user: `score-tracker-public`
2. Use this read-only policy:

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

### Step 4: Run Setup Wizard (One-Time Configuration)

1. Visit your deployed site: `https://YOUR-USERNAME.github.io/score_tracker/setup-wizard.html`
2. Follow the wizard:
   - **Step 1:** Welcome screen
   - **Step 2:** Enter AWS credentials (Access Key, Secret Key, Region)
   - **Step 3:** Create admin password
   - **Step 4:** (Optional) Configure public access
   - **Step 5:** Complete! 🎉

**Important:** This wizard saves your credentials **locally in your browser**. They are:
- ✅ Never sent to any server except AWS
- ✅ Stored only in your browser's localStorage
- ✅ Only accessible from the browser where you configured them

### Step 5: Access from Any Device

#### For Admin Access:

1. Visit: `https://YOUR-USERNAME.github.io/score_tracker/`
2. Login with your admin password
3. Start managing users and scores!

**First time on a new device?**
- Run the setup wizard again on that device
- Or manually configure AWS credentials in the admin panel

#### For Public View:

1. Share this URL: `https://YOUR-USERNAME.github.io/score_tracker/public.html`
2. Anyone can view statistics (read-only)
3. No login required!

## 📱 Access from Mobile Phones

The Score Tracker is fully responsive and works on:
- ✅ iPhone / iPad (Safari)
- ✅ Android phones (Chrome)
- ✅ Tablets
- ✅ Desktop browsers

**Tips for mobile access:**
1. Bookmark the URLs for quick access
2. Add to home screen for app-like experience:
   - **iOS:** Tap Share → Add to Home Screen
   - **Android:** Tap Menu → Add to Home screen

## 🔐 Security Features

### Current Security Model

✅ **Client-side Authentication**
- Password-protected admin panel
- Sessions expire after 24 hours
- No server-side authentication needed

✅ **AWS Credential Separation**
- Admin: Full read/write access (stored locally)
- Public: Read-only access (safe to expose)

✅ **Local Storage**
- Credentials stored in browser localStorage
- Never transmitted except to AWS
- Accessible only on configured devices

### Upgrading Security for Production

For production deployment with multiple admin users, consider:

#### Option 1: AWS Cognito (Recommended)

AWS Cognito provides:
- ✅ Multi-user authentication
- ✅ User pools and groups
- ✅ MFA (Multi-Factor Authentication)
- ✅ Social login (Google, Facebook, etc.)
- ✅ Password policies and reset flows

**Quick Setup:**

1. Create a Cognito User Pool in AWS
2. Configure app client
3. Update the application to use Cognito authentication
4. See [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)

#### Option 2: AWS Amplify

For a complete solution:

```bash
npm install -g @aws-amplify/cli
amplify init
amplify add auth
amplify push
```

This provides:
- User authentication
- Secure API endpoints
- File storage
- Real-time data sync

## 🎮 Using the Application

### Admin Panel Features

1. **User Management**
   - Add players with names and emails
   - View all registered players
   - Automatic user ID generation

2. **Score Entry**
   - Select player
   - Enter game name, score, amount won
   - Set date
   - Submit scores

3. **Score History**
   - View all recorded scores
   - Filter by player
   - See detailed statistics
   - Export data (coming soon)

4. **Summary Statistics**
   - Total games played
   - Total amount won
   - Average winnings per game
   - Best single win

### Public View Features

- View aggregated player statistics
- Filter by specific players
- See overall statistics
- No login required
- Mobile-friendly

## 🔧 Troubleshooting

### "Please configure AWS settings first"

**Solution:** Run the setup wizard or manually enter credentials in the admin panel.

### Can't access admin panel from another device

**Solution:** The setup is device-specific. Run the setup wizard on each device, OR use the same browser profile across devices (e.g., Chrome sync).

### Public view shows "not configured"

**Solution:** 
1. You need to set up public read-only credentials
2. Run setup wizard again and enable public access in Step 4
3. Or manually set credentials via browser console (see PUBLIC_VIEW_SETUP.md)

### AWS Access Denied errors

**Solution:**
- Verify IAM policy is correct
- Check table names match exactly
- Ensure region is correct (e.g., us-east-1)
- Verify credentials are valid

### Forgot admin password

**Solution:**
1. Open browser developer console (F12)
2. Go to Application → Local Storage
3. Delete the `adminPassword` key
4. Refresh page and it will reset to default (`admin123`)
5. Login and set a new password

## 💰 Cost Estimate

AWS DynamoDB costs with Pay-Per-Request pricing:

- **DynamoDB:** ~$1-5/month for typical usage (1000 scores, 100 users)
- **Data Transfer:** Free (GitHub Pages handles hosting)
- **Total:** ~$1-5/month

**Free Tier Benefits:**
- First 25 GB storage: Free
- First 25 read/write capacity units: Free

## 🆘 Support & Resources

- **Documentation:** See other .md files in this repository
- **AWS DynamoDB:** [Documentation](https://docs.aws.amazon.com/dynamodb/)
- **GitHub Pages:** [Documentation](https://docs.github.com/pages)
- **AWS Cognito:** [Documentation](https://docs.aws.amazon.com/cognito/)

## 📝 Best Practices

1. **Security**
   - Change default password immediately
   - Use strong, unique passwords
   - Rotate AWS credentials every 90 days
   - Enable CloudTrail for audit logging

2. **Backups**
   - Enable Point-in-Time Recovery for DynamoDB
   - Export data regularly
   - Keep backups of configuration

3. **Monitoring**
   - Set up CloudWatch alarms
   - Monitor DynamoDB metrics
   - Set up billing alerts

4. **Performance**
   - Use on-demand billing for variable workloads
   - Consider provisioned capacity for predictable traffic
   - Monitor read/write capacity usage

## 🎉 What's Next?

After deployment:

1. ✅ Add your first users
2. ✅ Record some test scores
3. ✅ Share the public view URL with players
4. ✅ Customize the application (colors, branding, etc.)
5. ✅ Set up regular backups
6. ✅ Consider upgrading to AWS Cognito for production

---

**Deployed successfully?** Give us a ⭐ on GitHub!

**Need help?** Check the other documentation files or open an issue.

**Want to contribute?** Pull requests are welcome!
