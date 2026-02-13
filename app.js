// AWS DynamoDB Configuration
let dynamoDB = null;
let docClient = null;
let config = {
    region: '',
    accessKeyId: '',
    secretAccessKey: '',
    usersTable: 'score-tracker-users',
    scoresTable: 'score-tracker-scores'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadConfigFromStorage();
    initializeAWS();
    setTodayDate();
});

// Load configuration from localStorage
function loadConfigFromStorage() {
    const savedConfig = localStorage.getItem('awsConfig');
    if (savedConfig) {
        config = JSON.parse(savedConfig);
        document.getElementById('region').value = config.region || 'us-east-1';
        document.getElementById('accessKeyId').value = config.accessKeyId || '';
        document.getElementById('secretAccessKey').value = config.secretAccessKey || '';
        document.getElementById('usersTable').value = config.usersTable || 'score-tracker-users';
        document.getElementById('scoresTable').value = config.scoresTable || 'score-tracker-scores';
    }
}

// Save configuration
function saveConfig() {
    config.region = document.getElementById('region').value;
    config.accessKeyId = document.getElementById('accessKeyId').value;
    config.secretAccessKey = document.getElementById('secretAccessKey').value;
    config.usersTable = document.getElementById('usersTable').value;
    config.scoresTable = document.getElementById('scoresTable').value;

    if (!config.region || !config.accessKeyId || !config.secretAccessKey) {
        showNotification('Please fill in all AWS configuration fields', 'error');
        return;
    }

    localStorage.setItem('awsConfig', JSON.stringify(config));
    initializeAWS();
    showNotification('Configuration saved successfully!', 'success');
    
    // Load users and scores after configuration
    setTimeout(() => {
        loadUsers();
        loadScores();
    }, 500);
}

// Initialize AWS SDK
function initializeAWS() {
    if (!config.accessKeyId || !config.secretAccessKey || !config.region) {
        console.log('AWS not configured yet');
        return;
    }

    AWS.config.update({
        region: config.region,
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    });

    dynamoDB = new AWS.DynamoDB();
    docClient = new AWS.DynamoDB.DocumentClient();
    
    console.log('AWS SDK initialized');
}

// Add User
async function addUser() {
    if (!docClient) {
        showNotification('Please configure AWS settings first', 'error');
        return;
    }

    const userName = document.getElementById('userName').value.trim();
    const userEmail = document.getElementById('userEmail').value.trim();

    if (!userName) {
        showNotification('Please enter a user name', 'error');
        return;
    }

    const userId = generateId();
    const timestamp = new Date().toISOString();

    const params = {
        TableName: config.usersTable,
        Item: {
            userId: userId,
            userName: userName,
            email: userEmail || '',
            createdAt: timestamp,
            updatedAt: timestamp
        }
    };

    try {
        await docClient.put(params).promise();
        showNotification(`User "${userName}" added successfully!`, 'success');
        document.getElementById('userName').value = '';
        document.getElementById('userEmail').value = '';
        loadUsers();
    } catch (error) {
        console.error('Error adding user:', error);
        showNotification(`Error adding user: ${error.message}`, 'error');
    }
}

// Load Users
async function loadUsers() {
    if (!docClient) {
        showNotification('Please configure AWS settings first', 'error');
        return;
    }

    const params = {
        TableName: config.usersTable
    };

    try {
        const data = await docClient.scan(params).promise();
        displayUsers(data.Items);
        populateUserDropdowns(data.Items);
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification(`Error loading users: ${error.message}`, 'error');
    }
}

// Display Users
function displayUsers(users) {
    const container = document.getElementById('usersContainer');
    container.innerHTML = '';

    if (users.length === 0) {
        container.innerHTML = '<li>No users found. Add a user to get started.</li>';
        return;
    }

    users.sort((a, b) => a.userName.localeCompare(b.userName));

    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${user.userName}</strong>
            ${user.email ? `<br><small>📧 ${user.email}</small>` : ''}
            <br><small>ID: ${user.userId}</small>
        `;
        container.appendChild(li);
    });
}

// Populate User Dropdowns
function populateUserDropdowns(users) {
    const scoreUserSelect = document.getElementById('scoreUser');
    const filterUserSelect = document.getElementById('filterUser');

    // Clear existing options (except first)
    scoreUserSelect.innerHTML = '<option value="">-- Select User --</option>';
    filterUserSelect.innerHTML = '<option value="">All Users</option>';

    users.sort((a, b) => a.userName.localeCompare(b.userName));

    users.forEach(user => {
        const option1 = document.createElement('option');
        option1.value = user.userId;
        option1.textContent = user.userName;
        scoreUserSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = user.userId;
        option2.textContent = user.userName;
        filterUserSelect.appendChild(option2);
    });
}

// Add Score
async function addScore() {
    if (!docClient) {
        showNotification('Please configure AWS settings first', 'error');
        return;
    }

    const userId = document.getElementById('scoreUser').value;
    const gameName = document.getElementById('gameName').value.trim();
    const scoreValue = parseFloat(document.getElementById('scoreValue').value) || 0;
    const amountWon = parseFloat(document.getElementById('amountWon').value) || 0;
    const gameDate = document.getElementById('gameDate').value;

    if (!userId) {
        showNotification('Please select a user', 'error');
        return;
    }

    if (!gameName) {
        showNotification('Please enter a game name', 'error');
        return;
    }

    if (!gameDate) {
        showNotification('Please select a date', 'error');
        return;
    }

    const scoreId = generateId();
    const timestamp = new Date().toISOString();

    // Get user name for display
    const userName = document.getElementById('scoreUser').selectedOptions[0].text;

    const params = {
        TableName: config.scoresTable,
        Item: {
            scoreId: scoreId,
            userId: userId,
            userName: userName,
            gameName: gameName,
            score: scoreValue,
            amountWon: amountWon,
            gameDate: gameDate,
            createdAt: timestamp,
            updatedAt: timestamp
        }
    };

    try {
        await docClient.put(params).promise();
        showNotification('Score added successfully!', 'success');
        
        // Clear form
        document.getElementById('gameName').value = '';
        document.getElementById('scoreValue').value = '';
        document.getElementById('amountWon').value = '';
        setTodayDate();
        
        loadScores();
    } catch (error) {
        console.error('Error adding score:', error);
        showNotification(`Error adding score: ${error.message}`, 'error');
    }
}

// Load Scores
async function loadScores() {
    if (!docClient) {
        showNotification('Please configure AWS settings first', 'error');
        return;
    }

    const filterUserId = document.getElementById('filterUser').value;

    let params = {
        TableName: config.scoresTable
    };

    // If filtering by user, add filter expression
    if (filterUserId) {
        params.FilterExpression = 'userId = :userId';
        params.ExpressionAttributeValues = {
            ':userId': filterUserId
        };
    }

    try {
        const data = await docClient.scan(params).promise();
        displayScores(data.Items);
        displaySummary(data.Items);
    } catch (error) {
        console.error('Error loading scores:', error);
        showNotification(`Error loading scores: ${error.message}`, 'error');
    }
}

// Display Scores
function displayScores(scores) {
    const tbody = document.getElementById('scoresTableBody');
    tbody.innerHTML = '';

    if (scores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No scores found. Add a score to get started.</td></tr>';
        return;
    }

    // Sort by date (most recent first)
    scores.sort((a, b) => new Date(b.gameDate) - new Date(a.gameDate));

    scores.forEach(score => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatDate(score.gameDate)}</td>
            <td>${score.userName}</td>
            <td>${score.gameName}</td>
            <td>${score.score}</td>
            <td>$${score.amountWon.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Display Summary
function displaySummary(scores) {
    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = '';

    if (scores.length === 0) {
        summaryContent.innerHTML = '<p>No data available for summary.</p>';
        return;
    }

    const totalGames = scores.length;
    const totalAmount = scores.reduce((sum, score) => sum + score.amountWon, 0);
    const avgAmount = totalAmount / totalGames;
    const maxAmount = Math.max(...scores.map(s => s.amountWon));

    const summaryItems = [
        { label: 'Total Games', value: totalGames },
        { label: 'Total Amount Won', value: `$${totalAmount.toFixed(2)}` },
        { label: 'Average per Game', value: `$${avgAmount.toFixed(2)}` },
        { label: 'Best Win', value: `$${maxAmount.toFixed(2)}` }
    ];

    summaryItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'summary-item';
        div.innerHTML = `
            <div class="label">${item.label}</div>
            <div class="value">${item.value}</div>
        `;
        summaryContent.appendChild(div);
    });
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('gameDate').value = today;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
