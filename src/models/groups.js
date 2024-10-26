// src/models/groups.js
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/groups.json');

// Ensure data directory exists
const ensureDataDirectory = async () => {
    const dataDir = path.join(__dirname, '../../data');
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
};

const loadGroups = async () => {
    await ensureDataDirectory();

    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is invalid, return default groups
        const defaultGroups = [
            { id: 1, name: 'Red Team', points: 0, history: [] },
            { id: 2, name: 'Blue Team', points: 0, history: [] },
            { id: 3, name: 'Green Team', points: 0, history: [] },
            { id: 4, name: 'Yellow Team', points: 0, history: [] }
        ];
        await saveGroups(defaultGroups);
        return defaultGroups;
    }
};

const saveGroups = async (groups) => {
    await ensureDataDirectory();
    await fs.writeFile(DATA_FILE, JSON.stringify(groups, null, 2), 'utf8');
};

let groups = [];

// Initialize groups when the module loads
(async () => {
    groups = await loadGroups();
})();

const findGroup = (id) => groups.find(g => g.id === id);

const addPoints = async (id, points, description = '') => {
    const group = findGroup(id);
    if (group) {
        const timestamp = new Date().toISOString();
        group.points += points;
        group.history.push({
            id: timestamp,
            points,
            timestamp,
            description
        });
        await saveGroups(groups);
        return group;
    }
    return null;
};

const withdrawPoints = async (groupId, historyId) => {
    const group = findGroup(groupId);
    if (group) {
        const historyEntry = group.history.find(h => h.id === historyId);
        if (historyEntry) {
            group.points -= historyEntry.points;
            group.history = group.history.filter(h => h.id !== historyId);
            await saveGroups(groups);
            return group;
        }
    }
    return null;
};

const getTopThree = () => {
    return [...groups]
        .sort((a, b) => b.points - a.points)
        .slice(0, 4);
};

const getAllGroups = () => {
    return [...groups].sort((a, b) => b.points - a.points);
};

module.exports = {
    groups,
    findGroup,
    addPoints,
    withdrawPoints,
    getTopThree,
    getAllGroups
};