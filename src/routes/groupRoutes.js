const express = require('express');
const router = express.Router();
const { getTopThree, addPoints, withdrawPoints, getAllGroups } = require('../models/groups');

router.get('/', (req, res) => {
    const topGroups = getTopThree();
    res.json(topGroups);
});

router.get('/all', (req, res) => {
    const allGroups = getAllGroups();
    res.json(allGroups);
});

router.post('/:id/add-points', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const points = parseFloat(req.body.points) || 1;
        const description = req.body.description || '';
        
        // Validate points input
        if (isNaN(points)) {
            return res.status(400).json({ error: 'Invalid points value' });
        }
        
        // Round to 2 decimal places to prevent floating point precision issues
        const roundedPoints = Math.round(points * 100) / 100;
        
        const updatedGroup = await addPoints(id, roundedPoints, description);
        if (updatedGroup) {
            res.json(updatedGroup);
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    } catch (error) {
        console.error('Error adding points:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/:groupId/withdraw/:historyId', async (req, res) => {
    try {
        const groupId = parseInt(req.params.groupId);
        const historyId = req.params.historyId;
        
        const updatedGroup = await withdrawPoints(groupId, historyId);
        if (updatedGroup) {
            res.json(updatedGroup);
        } else {
            res.status(404).json({ error: 'Entry not found' });
        }
    } catch (error) {
        console.error('Error withdrawing points:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;