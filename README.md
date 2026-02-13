# Score Tracker 🎮

A modern, GitHub Pages-based web application for tracking game scores and amounts won per player. Features a futuristic gaming UI with neon aesthetics and secure cloud storage via AWS DynamoDB.

## ✨ Features

### 🎨 Modern Gaming UI
- 🎮 **Futuristic Design** - Neon colors, animations, and gaming-inspired aesthetics
- 📱 **Fully Responsive** - Works perfectly on phones, tablets, and desktops
- 🌙 **Dark Theme** - Easy on the eyes with cyberpunk-style visuals
- ⚡ **Smooth Animations** - Engaging user experience with fluid transitions

### 🔐 Secure Access
- 🔒 **Password-Protected Admin Panel** - Secure administrative access
- 👥 **Public View** - Optional read-only access for viewing statistics
- 🔑 **One-Time Setup** - Configure AWS credentials once per device
- 🌍 **Access from Anywhere** - Use from any device with internet

### 📊 Score Management
- ✅ User management (add and view users)
- ✅ Score entry interface (record game name, score, amount won, and date)
- ✅ Score history with filtering by user
- ✅ Summary statistics (total games, total/average/best winnings)
- ✅ Real-time data sync with DynamoDB

### ⚙️ Easy Setup
- 🧙 **Setup Wizard** - Guided one-time configuration
- 📖 **Comprehensive Documentation** - Step-by-step guides
- ☁️ **Cloud Storage** - Reliable AWS DynamoDB backend
- 🚀 **GitHub Pages Hosting** - Free, reliable hosting

## 🚀 Quick Start

### For First-Time Users

1. **Visit the Setup Wizard:** [setup-wizard.html](setup-wizard.html)
2. **Follow the 5-step guide:**
   - Welcome & Prerequisites
   - AWS Configuration
   - Admin Password Setup
   - Public Access (Optional)
   - Complete Setup
3. **Start tracking scores!**

### For Detailed Instructions

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for comprehensive deployment instructions.

## Live Demo

Once deployed to GitHub Pages, access the application at:
`https://YOUR-USERNAME.github.io/score_tracker/`

**Example URLs:**
- **Admin Login:** `https://YOUR-USERNAME.github.io/score_tracker/`
- **Setup Wizard:** `https://YOUR-USERNAME.github.io/score_tracker/setup-wizard.html`
- **Public View:** `https://YOUR-USERNAME.github.io/score_tracker/public.html`

## 📱 Access from Any Device

Score Tracker works seamlessly across all devices:

- ✅ **Desktop** - Full features on Chrome, Firefox, Safari, Edge
- ✅ **Mobile** - iPhone, Android phones (fully responsive)
- ✅ **Tablet** - iPad, Android tablets
- ✅ **Multiple Devices** - Run setup wizard on each device for quick access

**Tips:**
- Bookmark URLs for quick access
- Add to home screen on mobile for app-like experience
- Credentials stored locally per device (secure and private)

## Setup Instructions

### Quick Setup (Recommended)

1. **Enable GitHub Pages** (if not already done)
   - Go to repository Settings → Pages
   - Select your main branch
   - Save

2. **Run Setup Wizard**
   - Visit: `https://YOUR-USERNAME.github.io/score_tracker/setup-wizard.html`
   - Follow the 5-step wizard
   - Configuration saved locally in your browser

3. **Start Using**
   - Login with your admin password
   - Add users and record scores

### Manual Setup

See detailed instructions in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

### 1. AWS DynamoDB Setup

Before using the application, you need to set up two DynamoDB tables:

1. **Users Table**: `score-tracker-users`
2. **Scores Table**: `score-tracker-scores`

See [DYNAMODB_SETUP.md](DYNAMODB_SETUP.md) for detailed instructions on creating these tables.

Quick setup using AWS CLI:
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

### 2. AWS IAM User Setup

Create an IAM user with programmatic access and attach a policy that allows DynamoDB operations on the two tables. See [DYNAMODB_SETUP.md](DYNAMODB_SETUP.md) for the required IAM permissions.

### 3. GitHub Pages Deployment

Enable GitHub Pages for this repository:

1. Go to repository Settings
2. Navigate to "Pages" section
3. Under "Source", select the main/master branch
4. Save the settings
5. Your site will be published at `https://tejamakkena.github.io/score_tracker/`

### 4. Configure the Application

#### For Admin Access:

1. Open the deployed GitHub Pages URL
2. Log in with the default password: `admin123`
3. In the "AWS Configuration" section, enter:
   - AWS Region (e.g., `us-east-1`)
   - Access Key ID (from admin IAM user with full permissions)
   - Secret Access Key (from admin IAM user)
   - Users Table Name (default: `score-tracker-users`)
   - Scores Table Name (default: `score-tracker-scores`)
   - Admin Password (change from default `admin123` to your own secure password)
4. Click "Save Configuration"

#### For Public View:

See [PUBLIC_VIEW_SETUP.md](PUBLIC_VIEW_SETUP.md) for detailed instructions on configuring read-only public access.

**Security Note**: 
- Admin credentials are stored only in your browser's localStorage and are never sent to any server except AWS
- Public view uses read-only AWS credentials that can only read data, not modify it
- Admin access is protected by password authentication

## Usage

### Public View (No Login Required)

1. Visit `public.html` (or the main page will show a link)
2. View aggregated player statistics including:
   - Total games played per player
   - Total amount won per player
   - Average winnings per game
3. Filter by specific player to see their individual stats
4. No authentication required, read-only access

### Admin Panel (Login Required)

#### Logging In

1. Visit the main page (index.html)
2. Enter admin password (default: `admin123`, change this immediately!)
3. Click "Login"
4. You'll be redirected to the admin panel

#### Adding Users

1. Go to the "User Management" section
2. Enter a user name (required) and email (optional)
3. Click "Add User"
4. Users will appear in the "Registered Users" list

#### Recording Scores

1. Go to the "Enter Score" section
2. Select a user from the dropdown
3. Enter the game name, score, amount won, and date
4. Click "Submit Score"

#### Viewing Score History

1. The "Score History" section displays all recorded scores
2. Use the "Filter by User" dropdown to see scores for a specific user
3. Click "Refresh" to reload the latest data
4. View summary statistics including total games, total amount won, average per game, and best win

#### Logging Out

Click the "Logout" button in the header to end your admin session

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend/Database**: AWS DynamoDB
- **Hosting**: GitHub Pages
- **AWS SDK**: AWS SDK for JavaScript v2

## Security Considerations

### Current Implementation

✅ **Client-Side Authentication**
- Password-protected admin panel with sessionStorage
- Sessions expire after 24 hours
- Default password: `admin123` (MUST be changed immediately)

✅ **AWS Credential Separation**
- **Admin credentials:** Full DynamoDB access (stored locally)
- **Public credentials:** Read-only access (safe to expose)

✅ **Local Storage Security**
- Credentials stored in browser localStorage
- Never transmitted except to AWS services
- Accessible only on configured devices

### Production Security Upgrade

For production deployment with multiple admin users, we recommend AWS Cognito:

**Benefits:**
- ✅ Multi-user authentication
- ✅ User pools and groups
- ✅ Multi-factor authentication (MFA)
- ✅ Password policies and recovery
- ✅ Social login integration

**See:** [COGNITO_INTEGRATION.md](COGNITO_INTEGRATION.md) for complete integration guide.

### Best Practices

1. **Change default password immediately** after first login
2. **Use strong passwords** for admin access
3. **Rotate AWS credentials regularly**
4. **Monitor CloudWatch** for unusual DynamoDB access patterns
5. **Never commit credentials** to version control
6. **Use HTTPS only** (GitHub Pages provides this by default)
7. **Restrict IP access** to DynamoDB if possible using security groups

## Local Development

To test locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/tejamakkena/score_tracker.git
   cd score_tracker
   ```

2. Open `index.html` in a web browser or use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```

3. Navigate to `http://localhost:8000` in your browser

## Troubleshooting

### "Access Denied" Errors
- Verify your IAM user has the correct permissions
- Check that table names match exactly
- Ensure the region is correct

### "Table Not Found" Errors
- Confirm tables are created in the correct AWS region
- Verify table names in the configuration match actual table names

### Scores Not Appearing
- Check browser console for errors
- Verify AWS credentials are valid
- Click "Refresh" to reload data
- Ensure JavaScript is enabled in your browser

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

MIT License - Feel free to use and modify for your own purposes.

## Author

Personal repo that tracks the amount won in a day.
