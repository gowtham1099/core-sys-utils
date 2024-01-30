/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
const { logger } = require("./logger");

/**
 * Send success message with status to client
 * @param {*} res
 * @param {*} message
 * @param {*} data
 * @param {*} code
 */
exports.success = (res, message, data = {}, code = 200) => {
    const result = {};
    result.success = true;
    result.code = code;
    result.message = message;
    if (Object.keys(data).length !== 0) result.data = data;
    res.status(code).json(result);
};

/**
 * Send failure message with status to client
 * @param {*} res
 * @param {*} message
 * @param {*} code
 * @param {*} error
 */
exports.failure = (res, message, code = 422, error = {}) => {
    const result = {};
    result.success = false;
    result.code = code;
    result.message = message;
    if (Object.keys(error).length !== 0) result.error = error;
    res.status(code).json(result);
};

/**
 * Send crash message with status to client
 * @param {*} res
 * @param {*} exception
 * @param {*} code
 */
exports.crash = (res, exception, code = 500) => {
    logger.error(exception);
    const result = { success: false, code, message: "An internal server error occurred while processing your request." };
    res.status(code).json(result);
};
