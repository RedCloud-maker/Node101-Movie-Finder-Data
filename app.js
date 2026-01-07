require('dotenv').config();

// Start the server by importing the configured app
const app = require('./server/app');
const PORT = process.env.PORT || 3000;

// 5. Port Indication (Requirement: Log when server starts)
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});

module.exports = app;