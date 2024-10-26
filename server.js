const express = require('express');
const path = require('path');
const groupRoutes = require('./src/routes/groupRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/groups', groupRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
