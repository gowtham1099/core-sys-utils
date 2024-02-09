"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crash = exports.failure = exports.success = void 0;
/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
const logger = __importStar(require("./logger"));
/**
 * Send success message with status to client
 * @param res Response object
 * @param message Success message
 * @param data Data to be sent
 * @param code HTTP status code (default: 200)
 */
const success = (res, message, data = {}, code = 200) => {
    const result = { success: true, code, message };
    if (Object.keys(data).length !== 0)
        result.data = data;
    res.status(code).json(result);
};
exports.success = success;
/**
 * Send failure message with status to client
 * @param res Response object
 * @param message Failure message
 * @param code HTTP status code (default: 422)
 * @param error Additional error information
 */
const failure = (res, message, code = 422, error = {}) => {
    const result = { success: false, code, message };
    if (Object.keys(error).length !== 0)
        result.error = error;
    res.status(code).json(result);
};
exports.failure = failure;
/**
 * Send crash message with status to client
 * @param res Response object
 * @param exception Exception/error object
 * @param code HTTP status code (default: 500)
 */
const crash = (res, exception, code = 500) => {
    logger.error(exception);
    const result = { success: false, code, message: "An internal server error occurred while processing your request." };
    res.status(code).json(result);
};
exports.crash = crash;
