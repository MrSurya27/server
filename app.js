const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // Importing CORS
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDocs = YAML.load('./backend/api.yaml');
const { startMetricsServer, restResponseTimeHistogram } = require("./utils/metrics");
const responseTime = require("response-time");

app.use("/api_docs",swaggerUI.serve,swaggerUI.setup(swaggerJsDocs));

//To open swagger tun the paste the below command on chrome..
//http://localhost:4000/api_docs/



app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));

app.use(
    responseTime((req, res, time) => {
        if (req?.route?.path) {

            restResponseTimeHistogram.observe(
                {
                    method: req.method,          
                    route: req.route.path,      
                    status_code: res.statusCode 
                },
                time * 1000  
            );
        }
    })
);


app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

// Route Imports
const userRoutes = require("./routes/userRoutes");
const policyRoutes = require("./routes/policyRoutes");
const claimRoutes = require("./routes/claimRoutes");
app.get('/set-cookie', (req, res) => {
    // Set cookie
    res.cookie('myCookie', 'cookieValue', { maxAge: 900000, httpOnly: true });
    res.send('Cookie set successfully');
});
app.get('/', (req, res) => {
    res.send('API running');
});
app.use("", userRoutes);
app.use("", policyRoutes);
app.use("", claimRoutes);

// Middleware for errors
app.use(errorMiddleware);

module.exports = app;
