const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

const createGroupElement = (group, index) => {
    const position = index === 0 ? 'first' : index === 1 ? 'second' : 'third';
    return `
        <div class="group ${position}">
            <div class="group-name">${group.name}</div>
            <div class="points">${group.points} points</div>
        </div>
    `;
};

const createHistoryElement = (group, historyEntry) => {
    return `
        <div class="history-item">
            <div class="history-details">
                <strong>${group.name}</strong>: ${historyEntry.points} points
                ${historyEntry.description ? `<br><em>${historyEntry.description}</em>` : ''}
                <br><span class="timestamp">${formatDate(historyEntry.timestamp)}</span>
            </div>
            <button class="withdraw" onclick="withdrawPoints('${group.id}', '${historyEntry.id}')">
                Withdraw
            </button>
        </div>
    `;
};

const updateLeaderboard = async () => {
    try {
        const response = await fetch('/api/groups');
        const groups = await response.json();
        
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = groups
            .map((group, index) => createGroupElement(group, index))
            .join('');
    } catch (error) {
        console.error('Error updating leaderboard:', error);
    }
};

const updateHistory = async () => {
    try {
        const response = await fetch('/api/groups/all');
        const groups = await response.json();
        
        const historyList = document.getElementById('history-list');
        const historyHtml = groups
            .flatMap(group => 
                group.history
                    .map(entry => createHistoryElement(group, entry))
            )
            .sort((a, b) => b.timestamp - a.timestamp)
            .join('');
        
        historyList.innerHTML = historyHtml || '<p>No history yet</p>';
    } catch (error) {
        console.error('Error updating history:', error);
    }
};

const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    const groupId = document.getElementById('group-select').value;
    const points = document.getElementById('points-input').value;
    const description = document.getElementById('description-input').value;
    
    try {
        await fetch(`/api/groups/${groupId}/add-points`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                points: parseFloat(points),
                description
            })
        });
        
        await updateLeaderboard();
        await updateHistory();
        
        // Reset form
        document.getElementById('points-input').value = '1';
        document.getElementById('description-input').value = '';
    } catch (error) {
        console.error('Error adding points:', error);
        alert('Error adding points. Please try again.');
    }
};

const withdrawPoints = async (groupId, historyId) => {
    try {
        await fetch(`/api/groups/${groupId}/withdraw/${historyId}`, {
            method: 'POST'
        });
        
        await updateLeaderboard();
        await updateHistory();
    } catch (error) {
        console.error('Error withdrawing points:', error);
        alert('Error withdrawing points. Please try again.');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('points-form').addEventListener('submit', handleFormSubmit);
    updateLeaderboard();
    updateHistory();
});