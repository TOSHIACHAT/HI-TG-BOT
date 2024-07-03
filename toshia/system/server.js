const express = require('express');
const path = require('path');
const { sys } = require('./logs.js');

const app = express();
const PORT = global.config.port;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    sys(`Server is running on http://localhost:${PORT}`);
});
