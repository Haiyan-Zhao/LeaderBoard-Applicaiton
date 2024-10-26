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
        const points = parseInt(req.body.points) || 1;
        const description = req.body.description || '';
        
        const updatedGroup = await addPoints(id, points, description);
        if (updatedGroup) {
            res.json(updatedGroup);
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    } catch (error) {
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
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;