# AWS Cognito Integration Guide

This guide explains how to upgrade Score Tracker to use AWS Cognito for secure multi-user authentication.

## 🎯 Why AWS Cognito?

Current setup uses simple password authentication stored in localStorage. For production with multiple admin users, AWS Cognito provides:

✅ **Multi-User Management**
- Individual user accounts for each admin
- User pools with centralized management
- User groups for role-based access

✅ **Enhanced Security**
- Built-in password policies
- Multi-factor authentication (MFA)
- Account recovery flows
- Password reset functionality

✅ **Social Login**
- Sign in with Google, Facebook, Amazon
- Reduce password fatigue
- Faster onboarding

✅ **Compliance**
- SOC, PCI DSS, HIPAA compliant
- Industry-standard security
- Audit logging

## 📋 Prerequisites

- AWS Account
- Score Tracker deployed and working
- AWS CLI installed (optional but recommended)
- Basic understanding of AWS Cognito

## 🚀 Step-by-Step Setup

### Step 1: Create Cognito User Pool

#### Using AWS Console:

1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito/)
2. Click **Manage User Pools**
3. Click **Create a user pool**

**Configure Pool:**

**Step 1: Attributes**
- Username attributes: **Email address**
- Standard attributes to require: **email**

**Step 2: Policies**
- Password minimum length: **12**
- Require uppercase, lowercase, numbers, and special characters
- MFA: **Optional** (or required for higher security)

**Step 3: MFA and Verifications**
- MFA: Optional or Required
- Email verification: **Enabled**
- Phone verification: Optional

**Step 4: Message Customizations**
- Customize email templates if desired
- Or use defaults

**Step 5: Tags**
- Add tags: `Project: ScoreTracker`, `Environment: Production`

**Step 6: Devices**
- Remember devices: Yes

**Step 7: App Clients**
- App client name: `score-tracker-web`
- Generate client secret: **No** (for web apps)
- Enable username password auth: **Yes**
- Auth flows: Enable `ALLOW_USER_PASSWORD_AUTH`

**Step 8: Triggers**
- Leave blank for now (advanced usage)

**Step 9: Review**
- Review and **Create pool**

**Save these values:**
- User Pool ID: `us-east-1_XXXXXXXXX`
- App Client ID: `xxxxxxxxxxxxxxxxxxxx`

#### Using AWS CLI:

```bash
# Create user pool
aws cognito-idp create-user-pool \
    --pool-name score-tracker-users \
    --policies "PasswordPolicy={MinimumLength=12,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=true}" \
    --auto-verified-attributes email \
    --username-attributes email \
    --mfa-configuration OPTIONAL

# Create app client
aws cognito-idp create-user-pool-client \
    --user-pool-id YOUR_USER_POOL_ID \
    --client-name score-tracker-web \
    --no-generate-secret \
    --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH
```

### Step 2: Create User Groups

Create groups for different access levels:

```bash
# Admin group (full access)
aws cognito-idp create-group \
    --user-pool-id YOUR_USER_POOL_ID \
    --group-name Admins \
    --description "Full access administrators"

# Viewer group (read-only)
aws cognito-idp create-group \
    --user-pool-id YOUR_USER_POOL_ID \
    --group-name Viewers \
    --description "Read-only access"
```

### Step 3: Create Initial Admin User

```bash
# Create admin user
aws cognito-idp admin-create-user \
    --user-pool-id YOUR_USER_POOL_ID \
    --username admin@example.com \
    --user-attributes Name=email,Value=admin@example.com \
    --temporary-password TempPassword123! \
    --message-action SUPPRESS

# Add to Admins group
aws cognito-idp admin-add-user-to-group \
    --user-pool-id YOUR_USER_POOL_ID \
    --username admin@example.com \
    --group-name Admins
```

### Step 4: Install AWS Amplify SDK

For the web application, use AWS Amplify:

```html
<!-- Add to your HTML files before closing </body> -->
<script src="https://cdn.jsdelivr.net/npm/amazon-cognito-identity-js@6.3.6/dist/amazon-cognito-identity.min.js"></script>
```

Or if using npm:

```bash
npm install amazon-cognito-identity-js
```

### Step 5: Update Application Code

Create a new file `cognito-auth.js`:

```javascript
// cognito-auth.js
const poolData = {
    UserPoolId: 'YOUR_USER_POOL_ID', // e.g., us-east-1_XXXXXXXXX
    ClientId: 'YOUR_APP_CLIENT_ID'
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Sign In
function cognitoSignIn(email, password) {
    const authenticationData = {
        Username: email,
        Password: password
    };
    
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    
    const userData = {
        Username: email,
        Pool: userPool
    };
    
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function(result) {
                const accessToken = result.getAccessToken().getJwtToken();
                const idToken = result.getIdToken().getJwtToken();
                
                // Store tokens
                sessionStorage.setItem('accessToken', accessToken);
                sessionStorage.setItem('idToken', idToken);
                sessionStorage.setItem('userEmail', email);
                
                resolve({
                    accessToken: accessToken,
                    idToken: idToken,
                    email: email
                });
            },
            onFailure: function(err) {
                reject(err);
            },
            newPasswordRequired: function(userAttributes, requiredAttributes) {
                // Handle new password requirement
                reject({
                    requireNewPassword: true,
                    cognitoUser: cognitoUser,
                    userAttributes: userAttributes
                });
            }
        });
    });
}

// Sign Out
function cognitoSignOut() {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
        cognitoUser.signOut();
    }
    sessionStorage.clear();
}

// Check if user is authenticated
function isCognitoAuthenticated() {
    const cognitoUser = userPool.getCurrentUser();
    
    if (!cognitoUser) {
        return false;
    }
    
    return new Promise((resolve) => {
        cognitoUser.getSession((err, session) => {
            if (err || !session.isValid()) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

// Get current user info
function getCurrentUserInfo() {
    const cognitoUser = userPool.getCurrentUser();
    
    if (!cognitoUser) {
        return Promise.reject('No user logged in');
    }
    
    return new Promise((resolve, reject) => {
        cognitoUser.getSession((err, session) => {
            if (err) {
                reject(err);
                return;
            }
            
            cognitoUser.getUserAttributes((err, attributes) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const userInfo = {};
                attributes.forEach(attr => {
                    userInfo[attr.Name] = attr.Value;
                });
                
                resolve(userInfo);
            });
        });
    });
}

// Change password
function changePassword(oldPassword, newPassword) {
    const cognitoUser = userPool.getCurrentUser();
    
    if (!cognitoUser) {
        return Promise.reject('No user logged in');
    }
    
    return new Promise((resolve, reject) => {
        cognitoUser.getSession((err, session) => {
            if (err) {
                reject(err);
                return;
            }
            
            cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });
}

// Forgot password
function forgotPassword(email) {
    const userData = {
        Username: email,
        Pool: userPool
    };
    
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    return new Promise((resolve, reject) => {
        cognitoUser.forgotPassword({
            onSuccess: function(result) {
                resolve(result);
            },
            onFailure: function(err) {
                reject(err);
            }
        });
    });
}

// Confirm forgot password
function confirmPassword(email, verificationCode, newPassword) {
    const userData = {
        Username: email,
        Pool: userPool
    };
    
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    return new Promise((resolve, reject) => {
        cognitoUser.confirmPassword(verificationCode, newPassword, {
            onSuccess: function() {
                resolve();
            },
            onFailure: function(err) {
                reject(err);
            }
        });
    });
}
```

### Step 6: Update index.html Login Page

Replace the login form handler:

```javascript
// Update handleLogin function in index.html
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    try {
        const result = await cognitoSignIn(email, password);
        showNotification('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } catch (error) {
        if (error.requireNewPassword) {
            // Handle first-time login
            showNotification('Please set a new password', 'info');
            // Show new password form
        } else {
            showNotification('Invalid email or password', 'error');
        }
        console.error('Login error:', error);
    }
}
```

Update the login form HTML:

```html
<form id="loginForm" onsubmit="handleLogin(event)">
    <div class="form-group">
        <label for="adminEmail">Email:</label>
        <input type="email" id="adminEmail" placeholder="Enter your email" required>
    </div>
    <div class="form-group">
        <label for="adminPassword">Password:</label>
        <input type="password" id="adminPassword" placeholder="Enter password" required>
    </div>
    <button type="submit" class="btn btn-primary" style="width: 100%; margin: 0;">Login</button>
</form>

<div style="margin-top: 15px; text-align: center;">
    <a href="#" onclick="handleForgotPassword()" style="color: var(--primary-neon);">Forgot Password?</a>
</div>
```

### Step 7: Update admin.html Authentication Check

```javascript
// Replace authentication check in admin.html
document.addEventListener('DOMContentLoaded', async function() {
    const isAuthenticated = await isCognitoAuthenticated();
    
    if (!isAuthenticated) {
        window.location.href = 'index.html';
        return;
    }
    
    // Load user info
    try {
        const userInfo = await getCurrentUserInfo();
        console.log('Logged in as:', userInfo.email);
        // Optionally display user name in header
    } catch (error) {
        console.error('Error loading user info:', error);
    }
    
    // Continue with existing initialization
    loadConfigFromStorage();
    initializeAWS();
    setTodayDate();
});
```

### Step 8: Update Logout Function

```javascript
// Update logout function in app.js
function logout() {
    cognitoSignOut();
    window.location.href = 'index.html';
}
```

### Step 9: Add User Management UI (Optional)

Create an admin section to manage Cognito users:

```javascript
// Add to app.js for admin user management

async function listCognitoUsers() {
    // This requires AWS SDK and admin credentials
    // Alternatively, use a Lambda function with API Gateway
    const params = {
        UserPoolId: 'YOUR_USER_POOL_ID',
        Limit: 60
    };
    
    try {
        const cognito = new AWS.CognitoIdentityServiceProvider({
            region: 'us-east-1',
            accessKeyId: adminAccessKeyId, // Requires admin AWS credentials
            secretAccessKey: adminSecretKey
        });
        
        const data = await cognito.listUsers(params).promise();
        return data.Users;
    } catch (error) {
        console.error('Error listing users:', error);
        throw error;
    }
}

async function createCognitoUser(email, temporaryPassword, isAdmin = false) {
    const params = {
        UserPoolId: 'YOUR_USER_POOL_ID',
        Username: email,
        UserAttributes: [
            {
                Name: 'email',
                Value: email
            },
            {
                Name: 'email_verified',
                Value: 'true'
            }
        ],
        TemporaryPassword: temporaryPassword,
        MessageAction: 'SUPPRESS' // Don't send welcome email
    };
    
    try {
        const cognito = new AWS.CognitoIdentityServiceProvider({
            region: 'us-east-1',
            accessKeyId: adminAccessKeyId,
            secretAccessKey: adminSecretKey
        });
        
        const result = await cognito.adminCreateUser(params).promise();
        
        // Add to group
        if (isAdmin) {
            await cognito.adminAddUserToGroup({
                UserPoolId: 'YOUR_USER_POOL_ID',
                Username: email,
                GroupName: 'Admins'
            }).promise();
        }
        
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}
```

## 🔒 Security Best Practices

### 1. Use MFA (Multi-Factor Authentication)

Enable MFA for all admin users:

```bash
aws cognito-idp set-user-pool-mfa-config \
    --user-pool-id YOUR_USER_POOL_ID \
    --mfa-configuration REQUIRED \
    --software-token-mfa-configuration Enabled=true
```

### 2. Set Up Password Policy

Enforce strong passwords:
- Minimum 12 characters
- Require uppercase, lowercase, numbers, symbols
- Password history: 5
- Password expiry: 90 days

### 3. Enable Account Recovery

Configure email-based password reset:
- Verification code delivery
- Time-limited reset links
- Account lockout after failed attempts

### 4. Monitor and Audit

Enable CloudTrail for Cognito:
```bash
aws cloudtrail create-trail \
    --name cognito-audit-trail \
    --s3-bucket-name my-audit-logs
```

### 5. Use HTTPS Only

Ensure all Cognito communication uses HTTPS (GitHub Pages does this by default).

## 📊 Cost Estimate

AWS Cognito pricing:
- **Free Tier:** 50,000 MAU (Monthly Active Users)
- **Beyond Free Tier:** $0.0055 per MAU

For a small team (10 users):
- **Cost:** FREE (within free tier)

## 🎯 Migration Path

### For Existing Users:

1. **Phase 1:** Deploy Cognito alongside existing auth
2. **Phase 2:** Migrate admin users to Cognito
3. **Phase 3:** Deprecate old auth system
4. **Phase 4:** Remove old auth code

### Migration Script:

```javascript
// Migrate existing users to Cognito
async function migrateUsers() {
    // Get list of emails from somewhere
    const emails = ['admin1@example.com', 'admin2@example.com'];
    
    for (const email of emails) {
        try {
            await createCognitoUser(email, generateTemporaryPassword(), true);
            console.log(`Migrated: ${email}`);
        } catch (error) {
            console.error(`Failed to migrate ${email}:`, error);
        }
    }
}
```

## 🆘 Troubleshooting

### User can't sign in

**Check:**
- Email is verified
- Password meets requirements
- User is not in "FORCE_CHANGE_PASSWORD" status
- MFA is properly configured

### Invalid credentials error

**Check:**
- User Pool ID is correct
- App Client ID is correct
- Auth flow is enabled in app client settings

### Token expired

Implement token refresh:

```javascript
function refreshSession() {
    const cognitoUser = userPool.getCurrentUser();
    
    if (!cognitoUser) {
        return Promise.reject('No user logged in');
    }
    
    return new Promise((resolve, reject) => {
        cognitoUser.getSession((err, session) => {
            if (err) {
                reject(err);
            } else {
                resolve(session);
            }
        });
    });
}
```

## 📚 Additional Resources

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)
- [AWS Amplify](https://docs.amplify.aws/)
- [Cognito Identity JS SDK](https://github.com/aws-amplify/amplify-js/tree/main/packages/amazon-cognito-identity-js)

## 🎉 Next Steps

After implementing Cognito:

1. ✅ Test login/logout flows
2. ✅ Test password reset
3. ✅ Set up MFA for admin users
4. ✅ Configure user groups and permissions
5. ✅ Monitor usage in CloudWatch
6. ✅ Document for your team

---

**Need help?** Check the AWS Cognito documentation or open an issue in the repository.
