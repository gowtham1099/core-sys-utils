/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
import { Request, Response, NextFunction } from "express";
import { FluentClient } from "@fluent-org/logger";
import config from "../config/config";

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
 *
 * @param {*} message
 */
export const info = (message: string): void => {
    console.log(message);
    fluentClient.emit("info", { microservice: config.ELASTIC_SEARCH.SERVICE_NAME, level: "info", message });
};

/**
 *
 * @param {*} exception
 */
export const error = (exception: Error | any): void => {
    console.log(exception);
    fluentClient.emit("error", {
        microservice: config.ELASTIC_SEARCH.SERVICE_NAME,
        level: "error",
        message: exception?.message ?? "",
        error: exception?.stack ?? "",
    });
};

/**
 * Middleware to log request and response
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const sendRequestLogsToElastic = (req: Request, res: Response, next: NextFunction): void => {
    res.on("finish", () => {
        try {
            const logData = {
                microservice: config.ELASTIC_SEARCH.SERVICE_NAME,
                level: "requests",
                date_and_time: new Date().toISOString(),
                user_type: (req.headers["x-consumer-username"] as string).split("_")?.[0],
                user_id: (req.headers["x-consumer-username"] as string).split("_")?.[1],
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
        } catch (e: any) {
            info(e.message);
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
const setResponseBody = (req: Request, res: Response, next: NextFunction): void => {
    const oldSend = res.send;
    res.send = (data): Response => {
        res.locals.body = data;
        return oldSend.call(res, data);
    };
    next();
};

// Middleware to capture request and response logs
export const captureRequests = (req: Request, res: Response, next: NextFunction): void => {
    // Set response body data to local field
    setResponseBody(req, res, () => {
        // Send request logs to elastic search
        sendRequestLogsToElastic(req, res, next);
    });
};
