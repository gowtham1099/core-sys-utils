/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
import * as logger from "./logger";
import { Response } from "express";

type ApiResponse<T = any> = {
    success: boolean;
    code: number;
    message: string;
    data?: T;
    error?: any;
};

/**
 * Send success message with status to client
 * @param res Response object
 * @param message Success message
 * @param data Data to be sent
 * @param code HTTP status code (default: 200)
 */
export const success = (res: Response, message: string, data: Record<string, any> = {}, code: number = 200): void => {
    const result: ApiResponse = { success: true, code, message };
    if (Object.keys(data).length !== 0) result.data = data;
    res.status(code).json(result);
};

/**
 * Send failure message with status to client
 * @param res Response object
 * @param message Failure message
 * @param code HTTP status code (default: 422)
 * @param error Additional error information
 */
export const failure = (res: Response, message: string, code: number = 422, error: Record<string, any> = {}): void => {
    const result: ApiResponse = { success: false, code, message };
    if (Object.keys(error).length !== 0) result.error = error;
    res.status(code).json(result);
};

/**
 * Send crash message with status to client
 * @param res Response object
 * @param exception Exception/error object
 * @param code HTTP status code (default: 500)
 */
export const crash = (res: Response, exception: Error, code: number = 500): void => {
    logger.error(exception);
    const result: ApiResponse = { success: false, code, message: "An internal server error occurred while processing your request." };
    res.status(code).json(result);
};
