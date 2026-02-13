# 🚀 Getting Started with Score Tracker

Welcome to Score Tracker! This guide will help you get started in just a few minutes.

## 🎯 What is Score Tracker?

Score Tracker is a modern web application for tracking game scores and winnings. It features:
- 🎮 **Futuristic gaming UI** with neon aesthetics
- ☁️ **Cloud storage** with AWS DynamoDB
- 🌍 **Access from anywhere** - Desktop, mobile, tablet
- 🔐 **Secure authentication** and credential management

## ⚡ Quick Start (5 Minutes)

### Step 1: Deploy to GitHub Pages (1 minute)

If you haven't already:

1. Go to your repository **Settings**
2. Click **Pages** in the sidebar
3. Under **Source**, select your **main** branch
4. Click **Save**
5. Your site will be at: `https://YOUR-USERNAME.github.io/score_tracker/`

### Step 2: Set Up AWS (One-Time, 10 minutes)

**Option A: Using AWS Console**

1. Go to [AWS DynamoDB Console](https://console.aws.amazon.com/dynamodb/)
2. Create two tables:
   - **Table 1:** Name: `score-tracker-users`, Key: `userId` (String)
   - **Table 2:** Name: `score-tracker-scores`, Key: `scoreId` (String)
3. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
4. Create a user: `score-tracker-admin`
5. Attach policy with DynamoDB permissions (see DEPLOYMENT_GUIDE.md)
6. Save your **Access Key ID** and **Secret Access Key**

**Option B: Using AWS CLI (Faster)**

```bash
# Create tables
aws dynamodb create-table \
    --table-name score-tracker-users \
    --attribute-definitions AttributeName=userId,AttributeType=S \
    --key-schema AttributeName=userId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST

aws dynamodb create-table \
    --table-name score-tracker-scores \
    --attribute-definitions AttributeName=scoreId,AttributeType=S \
    --key-schema AttributeName=scoreId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST

# Create IAM user (then attach policy from DEPLOYMENT_GUIDE.md)
aws iam create-user --user-name score-tracker-admin
aws iam create-access-key --user-name score-tracker-admin
```

### Step 3: Run Setup Wizard (2 minutes)

1. Visit: `https://YOUR-USERNAME.github.io/score_tracker/setup-wizard.html`
2. Follow the 5 steps:
   - **Step 1:** Read prerequisites
   - **Step 2:** Enter AWS credentials
   - **Step 3:** Create admin password
   - **Step 4:** (Optional) Configure public access
   - **Step 5:** Done!

### Step 4: Start Using (Now!)

1. Go to: `https://YOUR-USERNAME.github.io/score_tracker/`
2. Login with your admin password
3. Add users in the User Management section
4. Start recording scores!

## 📱 Access from Other Devices

**Same User, Different Device:**

1. Visit your Score Tracker URL on the new device
2. Run the setup wizard again (or manually enter AWS credentials in admin panel)
3. Your data is stored in DynamoDB, so it's accessible from any device!

**Share with Others:**

- **Admin Access:** Share URL + admin password (configured device)
- **Public View:** Share `https://YOUR-USERNAME.github.io/score_tracker/public.html`

## 🎮 Using Score Tracker

### Adding Users

1. Login to admin panel
2. Go to **User Management** section
3. Enter user name and email
4. Click **Add User**

### Recording Scores

1. Go to **Enter Score** section
2. Select user from dropdown
3. Enter game name, score, and amount won
4. Select date
5. Click **Submit Score**

### Viewing Statistics

**Admin Panel:**
- View all scores with filtering
- See summary statistics
- Total games, winnings, averages

**Public View:**
- Share with players
- Read-only access
- Aggregated statistics per player

## 🔐 Security Tips

### Must Do Immediately:
- ✅ Change default admin password (`admin123`)
- ✅ Use strong password (12+ characters)
- ✅ Keep AWS credentials secure

### Best Practices:
- 🔒 Don't share admin password
- 🔄 Rotate AWS credentials every 90 days
- 📱 Bookmark URLs for quick access
- 💾 Enable DynamoDB backups

## 📱 Mobile Tips

**Add to Home Screen:**

**iPhone/iPad:**
1. Open Score Tracker in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Enjoy app-like experience!

**Android:**
1. Open Score Tracker in Chrome
2. Tap menu (three dots)
3. Select "Add to Home screen"
4. Access like a native app!

## 🆘 Common Issues

### "Please configure AWS settings first"
**Solution:** Run the setup wizard or manually enter credentials in admin panel.

### Can't login on new device
**Solution:** Run setup wizard on each device. Credentials are stored locally per device.

### "Access Denied" errors
**Solution:** 
- Verify IAM policy is correct
- Check table names match exactly
- Ensure region is correct
- Verify credentials are valid

### Forgot admin password
**Solution:**
1. Open browser developer console (F12)
2. Go to Application → Local Storage
3. Delete the `adminPassword` key
4. Refresh - it resets to `admin123`

## 💰 Costs

**AWS DynamoDB:**
- Free tier: 25GB storage, 25 read/write units
- Typical usage: $1-5/month
- Small teams usually stay in free tier

**GitHub Pages:**
- Completely free for public repos
- 100GB bandwidth/month

## 📚 Learn More

**Documentation:**
- [README.md](README.md) - Overview and features
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Detailed deployment
- [COGNITO_INTEGRATION.md](COGNITO_INTEGRATION.md) - Production security
- [FEATURES_SUMMARY.md](FEATURES_SUMMARY.md) - Technical details

**AWS Resources:**
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [IAM Documentation](https://docs.aws.amazon.com/iam/)
- [Cognito Documentation](https://docs.aws.amazon.com/cognito/)

## 🎉 Success Checklist

- [ ] GitHub Pages deployed
- [ ] DynamoDB tables created
- [ ] IAM user and policy configured
- [ ] Setup wizard completed
- [ ] Admin password changed
- [ ] First user added
- [ ] First score recorded
- [ ] Public view working (optional)
- [ ] Bookmarked on mobile
- [ ] Shared with team

## 💡 Pro Tips

1. **Bookmark Everything**
   - Save login URL
   - Save public view URL
   - Save setup wizard URL

2. **Mobile First**
   - Add to home screen
   - Enable notifications (if using PWA)
   - Use landscape for better view

3. **Data Management**
   - Export data regularly
   - Enable DynamoDB backups
   - Monitor AWS costs

4. **Team Usage**
   - Share public view URL widely
   - Keep admin access limited
   - Document your admin password securely

## 🚀 What's Next?

### Beginner:
- Add more users
- Record daily scores
- Check statistics regularly

### Intermediate:
- Configure public access
- Customize colors/branding
- Set up billing alerts

### Advanced:
- Implement AWS Cognito
- Add custom domain
- Set up CI/CD pipeline
- Add data export features

## 🎯 Goals to Track

**Personal Use:**
- Daily game sessions
- Monthly winnings
- Personal best scores
- Improvement over time

**Team Use:**
- Tournament results
- League standings
- Player rankings
- Prize money distribution

## 📞 Need Help?

**Where to Get Help:**
1. Check documentation files
2. Review troubleshooting sections
3. Check AWS console for errors
4. Open GitHub issue
5. Review AWS documentation

**Before Asking for Help:**
- ✅ Check if credentials are correct
- ✅ Verify table names match
- ✅ Check browser console for errors
- ✅ Try on different browser
- ✅ Review documentation

## ✨ Enjoy Score Tracker!

You're all set! Start tracking your game scores and winnings with style. 🎮

**Questions or feedback?** Open an issue on GitHub!

**Enjoying Score Tracker?** Give us a ⭐ on GitHub!

---

**Happy Gaming!** 🎉
