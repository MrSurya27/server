const express = require("express");
const client = require("prom-client");

const app = express();
const restResponseTimeHistogram = new client.Histogram({
    name: 'rest_response_time_duration_seconds',
    help: 'REST API response time in seconds',
    labelNames: ['method', 'route', 'status_code']

})


const databaseresponseTimeHistogram = new client.Histogram({
    name: 'db_response_time_duration_seconds',
    help: 'Database response time in seconds',
    labelNames:['operations','success']
})

const startMetricsServer = () => {
    const collectDefaultMetrics = client.collectDefaultMetrics;
    collectDefaultMetrics();
    app.get('/metrics', async (req, res) => {
        res.set("Content-type", client.register.contentType);
        return res.send(await client.register.metrics());
    });

    app.listen(5000, () => {
        console.log("Metrics server started at http://localhost:5000");
    });
};

module.exports = { startMetricsServer,restResponseTimeHistogram };
