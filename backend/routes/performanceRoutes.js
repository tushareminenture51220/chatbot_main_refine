const { Router } = require("express");
const auth = require("../middlewares/auth");
const { getPerformanceData } = require("../controllers/performance.controller");

const performanceRouter = Router();

//get performanceData
performanceRouter.get("/get-performance-data", getPerformanceData);

module.exports = performanceRouter;
