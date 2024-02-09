/*
 * Created by Gowtham R
 * Created on Mon Feb 05 2024
 * Copyright (c) 2024
 */
import { Request, Response, NextFunction } from "express";
import { validationResult, check, ValidationChain } from "express-validator";
import * as response from "../helpers/response";

/**
 * Middleware to handle the result of validation using express-validator.
 * If there are validation errors, it sends a failure response; otherwise, it passes control to the next middleware.
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const handleResult = (req: Request, res: Response, next: NextFunction): void => {
    const hasErrors = validationResult(req);
    const errorMessages = hasErrors.array().map((error) => error.msg);
    if (!hasErrors.isEmpty()) return response.failure(res, errorMessages[0].msg, 400);
    return next();
};

/**
 * Creates a validation chain for checking if a field is a valid email.
 * @param field Field to be checked
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
export const checkEmail = (field: string, message: string): ValidationChain => check(field).trim().notEmpty().withMessage(message).isEmail().withMessage(`Invalid ${field}`);

/**
 * Creates a validation chain for checking if a field is a valid mobile phone number.
 * @param field Field to be checked
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
export const checkMobilePhone = (field: string, message: string): ValidationChain =>
    check(field).trim().notEmpty().withMessage(message).isMobilePhone("any").withMessage(`Invalid ${field}`);

/**
 * Creates a validation chain for checking if a field exists (not empty).
 * @param field Field to be checked
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
export const checkExists = (field: string, message: string): ValidationChain => check(field).trim().notEmpty().withMessage(message);

/**
 * Creates a validation chain for checking if a field is a valid number.
 * @param field Field to be checked
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
export const checkIsNumber = (field: string, message: string): ValidationChain =>
    check(field).trim().notEmpty().withMessage(message).isNumeric().withMessage(`${field} must be numeric`);

/**
 * Creates a validation chain for checking if a field is a valid boolean.
 * @param field Field to be checked
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
export const checkIsBoolean = (field: string, message: string): ValidationChain =>
    check(field).trim().notEmpty().withMessage(message).isBoolean().withMessage(`${field} must be boolean`);

/**
 * Creates a validation chain for checking if an array is not empty.
 * @param field Field (array) to be checked
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
export const checkArrayEmpty = (field: string, message: string): ValidationChain => check(field).isArray({ min: 1 }).notEmpty().withMessage(message);

/**
 * Creates a validation chain for checking if an array exists (not empty).
 * @param field Field (array) to be checked
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
export const checkArray = (field: string, message: string): ValidationChain => check(field).isArray({ min: 1 }).withMessage(message);

/**
 * Creates a validation chain for checking if a field is a valid IP address.
 * @param field Field to be checked
 * @returns Validation chain
 */
export const checkIPAddress = (field: string): ValidationChain => check(field).isIP().withMessage("Invalid IP Address");

/**
 * Creates a validation chain for checking if a field matches a specified regex pattern.
 * @param field Field to be checked
 * @param regex Regular expression pattern
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
export const checkRegex = (field: string, regex: RegExp, message: string): ValidationChain => check(field).matches(regex).withMessage(`Invalid ${field} format`);

/**
 * Creates a validation chain for checking if a field matches a specified code format.
 * @param field Field to be checked
 * @returns Validation chain
 */
export const checkCode = (field: string): ValidationChain =>
    check(field)
        .matches(/^[a-zA-Z_0-9]+$/)
        .withMessage(`Invalid ${field} format`);

/**
 * Creates a validation chain for checking if a field's value is within a specified set of items.
 * @param field Field to be checked
 * @param items Array of valid items
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
export const checkIsIn = (field: string, items: any[], message: string): ValidationChain => check(field).isIn(items).withMessage(`Invalid ${field}`);

/**
 * Creates a validation chain for checking if a field is a valid date.
 * @param field Field to be checked
 * @param format Date format (e.g., 'YYYY-MM-DD')
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
export const checkIsValidDate = (field: string, format: string, message: string): ValidationChain =>
    check(field).trim().notEmpty().withMessage(message).bail().isDate({ format }).withMessage(`Invalid ${field}`);
