const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const router = require("./routes/health.routes.js");
const authRouter = require("./routes/auth.routes.js");
const roleRouter = require("./routes/role.auth.routes.js");
const path = require('path');
const bycrypt = require('bcryptjs');
const userRouter = require("./routes/user.route.js");
const adminRouter = require("./routes/admin.routes.js");
const {generalLimiter} = require("./middleware/rateLimiter.js");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger.js");
const app = express();




/* ---------- Middlewares ---------- */


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(cors());

// app.use(morgan("dev"));

app.use(compression());

app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api",generalLimiter);

app.use(router);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);


app.get("/", (req, res) => {
    res.send("Welcome to the Pulse API server. Please refer to the documentation for available endpoints.");
});

module.exports = app;