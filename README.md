# Score Tracker 🎮

A GitHub Pages-based web application for tracking game scores and amounts won per player. Data is stored in AWS DynamoDB.

## Features

- ✅ **Public View** - Read-only access to player statistics and winnings
- ✅ **Admin Panel** - Secure admin access with password protection
- ✅ User management (add and view users)
- ✅ Score entry interface (record game name, score, amount won, and date)
- ✅ Score history with filtering by user
- ✅ Summary statistics (total games, total/average/best winnings)
- ✅ Responsive design that works on desktop and mobile
- ✅ Secure credential management with read-only and admin access levels
- ✅ Real-time data sync with DynamoDB

## Live Demo

Once deployed to GitHub Pages, access the application at:
`https://tejamakkena.github.io/score_tracker/`

## New Security Features

This application now supports:
- **Separate access levels**: Public view (read-only) and Admin panel (full access)
- **Admin authentication**: Password-protected admin panel
- **IAM-based security**: Separate AWS credentials for public and admin access
- **Session management**: Admin sessions expire after 24 hours

See [PUBLIC_VIEW_SETUP.md](PUBLIC_VIEW_SETUP.md) for detailed configuration instructions.

## Setup Instructions

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

⚠️ **Important Security Notes**:

### Current Implementation

- **Admin Authentication**: Simple password-based authentication stored in localStorage
- **Session Management**: Admin sessions expire after 24 hours
- **AWS Credentials**: Two separate IAM users recommended:
  - **Public/Read-Only**: Only `GetItem`, `Scan`, `Query` permissions on DynamoDB
  - **Admin**: Full DynamoDB permissions (`PutItem`, `GetItem`, `Scan`, `Query`, `UpdateItem`, `DeleteItem`)
- **Data Exposure**: Public view credentials are visible in source code (acceptable for public data)

### Security Limitations

- This is a client-side only application with basic security
- Admin password is stored in browser localStorage (client-side)
- AWS credentials are exposed in the frontend code
- No server-side validation or authentication

### Recommended for Production

**For production use**, consider implementing:
- **AWS Cognito** for user authentication and authorization
- **API Gateway + Lambda** for backend operations
- **No client-side credentials** - All AWS operations via secure backend
- **AWS Amplify** for a more secure and scalable architecture
- **Environment-specific credential management**
- **Multi-factor authentication (MFA)** for admin access
- **Audit logging** of all admin actions
- **Rate limiting** to prevent abuse

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
