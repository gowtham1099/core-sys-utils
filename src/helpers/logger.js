/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
const { FluentClient } = require("@fluent-org/logger");
const config = require("../config/config");

/**
 * Initialize Fluent Client
 */
const fluentClient = new FluentClient(config.ELASTIC_SEARCH.SERVICE_NAME, {
    socket: {
        host: config.ELASTIC_SEARCH.IP_ADDRESS,
        port: 9880,
        timeout: 3000, // 3 seconds
    },
});

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
                microservice: config.ELASTIC_SEARCH.SERVICE_NAME,
                level: "requests",
                date_and_time: new Date().toISOString(),
                user_type: req.headers["x-consumer-username"]?.split("_")?.[0],
                user_id: req.headers["x-consumer-username"]?.split("_")?.[1],
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
        } catch (e) {
            logger.error(e);
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
        oldSend.call(res, data);
    };
    next();
};

/**
 *
 * @param {*} message
 */
exports.info = (message) => {
    console.log(message);
    fluentClient.emit("info", { microservice: config.ELASTIC_SEARCH.SERVICE_NAME, level: "info", message });
};

/**
 *
 * @param {*} exception
 */
exports.error = (exception) => {
    console.log(exception);
    fluentClient.emit("error", {
        microservice: config.ELASTIC_SEARCH.SERVICE_NAME,
        level: "error",
        message: exception?.message ?? "",
        error: exception?.stack ?? "",
    });
};

// Middleware to capture request and response logs
exports.captureRequests = (req, res, next) => {
    // Set response body data to local field
    setResponseBody(req, res, () => {
        // Send request logs to elastic search
        sendRequestLogsToElastic(req, res, next);
    });
};
