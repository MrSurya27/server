const app = require('./app'); // Ensure this path is correct
const dotenv = require('dotenv');
const connectDatabase = require("./config/database");
const { startMetricsServer,restResponseTimeHistogram } = require("./utils/metrics");
const responseTime = require("response-time");


// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.error(`Error: ${err.message}`);
    console.error(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

// Config
dotenv.config({ path: "./backend/config/config.env" }); // Adjust the path if necessary

// Connecting to database
connectDatabase();

// Starting the metrics server
startMetricsServer();


// Starting the Express server
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

module.exports = server;

// Handling Unhandled Promise Rejection
process.on("unhandledRejection", err => {
    console.error(`Error: ${err.message}`);
    console.error(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(() => {
        process.exit(1);
    });
});


