"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureRequests = exports.error = exports.info = void 0;
const logger_1 = require("@fluent-org/logger");
const config_1 = __importDefault(require("../config/config"));
/**
 * Initialize Fluent Client
 */
const fluentClient = new logger_1.FluentClient(config_1.default.ELASTIC_SEARCH.SERVICE_NAME, {
    socket: {
        host: config_1.default.ELASTIC_SEARCH.IP_ADDRESS,
        port: 9880,
        timeout: 3000, // 3 seconds
    },
});
/**
 *
 * @param {*} message
 */
const info = (message) => {
    console.log(message);
    fluentClient.emit("info", { microservice: config_1.default.ELASTIC_SEARCH.SERVICE_NAME, level: "info", message });
};
exports.info = info;
/**
 *
 * @param {*} exception
 */
const error = (exception) => {
    console.log(exception);
    fluentClient.emit("error", {
        microservice: config_1.default.ELASTIC_SEARCH.SERVICE_NAME,
        level: "error",
        message: exception?.message ?? "",
        error: exception?.stack ?? "",
    });
};
exports.error = error;
/**
 * Middleware to log request and response
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const sendRequestLogsToElastic = (req, res, next) => {
    res.on("finish", () => {
        try {
            const logData = {
                microservice: config_1.default.ELASTIC_SEARCH.SERVICE_NAME,
                level: "requests",
                date_and_time: new Date().toISOString(),
                user_type: req.headers["x-consumer-username"].split("_")?.[0],
                user_id: req.headers["x-consumer-username"].split("_")?.[1],
                request: {
                    method: req.method,
                    path: req.baseUrl + req.path,
                    headers: JSON.stringify(req?.headers),
                    query: JSON.stringify(req?.query),
                    params: JSON.stringify(req?.params),
                    body: JSON.stringify(req?.body),
                },
                response: {
                    status: res?.statusCode,
                    result: res?.locals?.body ?? "{}",
                },
            };
            fluentClient.emit("requests", logData);
        }
        catch (e) {
            (0, exports.info)(e.message);
        }
    });
    next();
};
/**
 * Set response body data into the response
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const setResponseBody = (req, res, next) => {
    const oldSend = res.send;
    res.send = (data) => {
        res.locals.body = data;
        return oldSend.call(res, data);
    };
    next();
};
// Middleware to capture request and response logs
const captureRequests = (req, res, next) => {
    // Set response body data to local field
    setResponseBody(req, res, () => {
        // Send request logs to elastic search
        sendRequestLogsToElastic(req, res, next);
    });
};
exports.captureRequests = captureRequests;
