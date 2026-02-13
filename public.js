// Public View - Read-only AWS DynamoDB access
let docClient = null;
let config = {
    region: 'us-east-1',
    // Public read-only credentials - Configure these using the instructions in PUBLIC_VIEW_SETUP.md
    // These credentials should only have DynamoDB read permissions (GetItem, Scan, Query)
    accessKeyId: '',
    secretAccessKey: '',
    usersTable: 'score-tracker-users',
    scoresTable: 'score-tracker-scores'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadPublicConfig();
    initializeAWS();
    loadPublicStats();
});

// Load public configuration (read-only credentials)
function loadPublicConfig() {
    // In production, these should be read-only IAM credentials
    // For now, checking if credentials are embedded in a config file or environment
    const publicConfig = localStorage.getItem('publicAwsConfig');
    if (publicConfig) {
        const parsed = JSON.parse(publicConfig);
        config.region = parsed.region || config.region;
        config.accessKeyId = parsed.accessKeyId || config.accessKeyId;
        config.secretAccessKey = parsed.secretAccessKey || config.secretAccessKey;
        config.usersTable = parsed.usersTable || config.usersTable;
        config.scoresTable = parsed.scoresTable || config.scoresTable;
    }
}

// Initialize AWS SDK with read-only credentials
function initializeAWS() {
    if (!config.accessKeyId || !config.secretAccessKey) {
        showNotification('Public view not configured. Contact administrator.', 'info');
        return;
    }

    AWS.config.update({
        region: config.region,
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    });

    docClient = new AWS.DynamoDB.DocumentClient();
    console.log('AWS SDK initialized for public view');
}

// Load public statistics (aggregated data only)
async function loadPublicStats() {
    if (!docClient) {
        showNotification('Please wait, loading configuration...', 'info');
        return;
    }

    const filterUserId = document.getElementById('filterUser').value;

    try {
        // Load users first
        const usersData = await loadUsers();
        populateUserDropdown(usersData);

        // Load scores
        let scoresParams = {
            TableName: config.scoresTable
        };

        if (filterUserId) {
            scoresParams.FilterExpression = 'userId = :userId';
            scoresParams.ExpressionAttributeValues = {
                ':userId': filterUserId
            };
        }

        const scoresData = await docClient.scan(scoresParams).promise();
        displayPublicStats(scoresData.Items, usersData);
    } catch (error) {
        console.error('Error loading public stats:', error);
        showNotification(`Error loading data: ${error.message}`, 'error');
    }
}

// Load users from DynamoDB
async function loadUsers() {
    const params = {
        TableName: config.usersTable
    };

    try {
        const data = await docClient.scan(params).promise();
        return data.Items;
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification(`Error loading users: ${error.message}`, 'error');
        return [];
    }
}

// Populate user dropdown
function populateUserDropdown(users) {
    const filterUserSelect = document.getElementById('filterUser');
    filterUserSelect.innerHTML = '<option value="">All Players</option>';

    users.sort((a, b) => a.userName.localeCompare(b.userName));

    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.userId;
        option.textContent = user.userName;
        filterUserSelect.appendChild(option);
    });
}

// Display public statistics (aggregated by user)
function displayPublicStats(scores, users) {
    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = '';

    if (scores.length === 0) {
        summaryContent.innerHTML = '<p class="no-data">No data available.</p>';
        return;
    }

    // Create user map
    const userMap = {};
    users.forEach(user => {
        userMap[user.userId] = user.userName;
    });

    // Aggregate statistics by user
    const userStats = {};
    scores.forEach(score => {
        const userId = score.userId;
        if (!userStats[userId]) {
            userStats[userId] = {
                userName: score.userName || userMap[userId] || 'Unknown',
                totalGames: 0,
                totalWon: 0
            };
        }
        userStats[userId].totalGames++;
        userStats[userId].totalWon += score.amountWon || 0;
    });

    // Display as cards
    Object.keys(userStats).forEach(userId => {
        const stat = userStats[userId];
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `
            <div class="stat-card-header">${stat.userName}</div>
            <div class="stat-card-body">
                <div class="stat-item">
                    <span class="stat-label">Total Games:</span>
                    <span class="stat-value">${stat.totalGames}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Won:</span>
                    <span class="stat-value">$${stat.totalWon.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Average per Game:</span>
                    <span class="stat-value">$${(stat.totalWon / stat.totalGames).toFixed(2)}</span>
                </div>
            </div>
        `;
        summaryContent.appendChild(card);
    });

    // Add overall summary if viewing all users
    const filterUserId = document.getElementById('filterUser').value;
    if (!filterUserId && Object.keys(userStats).length > 1) {
        const totalGames = scores.length;
        const totalWon = scores.reduce((sum, score) => sum + (score.amountWon || 0), 0);
        
        const overallCard = document.createElement('div');
        overallCard.className = 'stat-card stat-card-highlight';
        overallCard.innerHTML = `
            <div class="stat-card-header">📊 Overall Statistics</div>
            <div class="stat-card-body">
                <div class="stat-item">
                    <span class="stat-label">Total Players:</span>
                    <span class="stat-value">${Object.keys(userStats).length}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Games:</span>
                    <span class="stat-value">${totalGames}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Won:</span>
                    <span class="stat-value">$${totalWon.toFixed(2)}</span>
                </div>
            </div>
        `;
        summaryContent.insertBefore(overallCard, summaryContent.firstChild);
    }
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
