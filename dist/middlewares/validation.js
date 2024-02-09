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
exports.checkIsValidDate = exports.checkIsIn = exports.checkCode = exports.checkRegex = exports.checkIPAddress = exports.checkArray = exports.checkArrayEmpty = exports.checkIsBoolean = exports.checkIsNumber = exports.checkExists = exports.checkMobilePhone = exports.checkEmail = exports.handleResult = void 0;
const express_validator_1 = require("express-validator");
const response = __importStar(require("../helpers/response"));
/**
 * Middleware to handle the result of validation using express-validator.
 * If there are validation errors, it sends a failure response; otherwise, it passes control to the next middleware.
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
const handleResult = (req, res, next) => {
    const hasErrors = (0, express_validator_1.validationResult)(req);
    const errorMessages = hasErrors.array().map((error) => error.msg);
    if (!hasErrors.isEmpty())
        return response.failure(res, errorMessages[0].msg, 400);
    return next();
};
exports.handleResult = handleResult;
/**
 * Creates a validation chain for checking if a field is a valid email.
 * @param field Field to be checked
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
const checkEmail = (field, message) => (0, express_validator_1.check)(field).trim().notEmpty().withMessage(message).isEmail().withMessage(`Invalid ${field}`);
exports.checkEmail = checkEmail;
/**
 * Creates a validation chain for checking if a field is a valid mobile phone number.
 * @param field Field to be checked
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
const checkMobilePhone = (field, message) => (0, express_validator_1.check)(field).trim().notEmpty().withMessage(message).isMobilePhone("any").withMessage(`Invalid ${field}`);
exports.checkMobilePhone = checkMobilePhone;
/**
 * Creates a validation chain for checking if a field exists (not empty).
 * @param field Field to be checked
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
const checkExists = (field, message) => (0, express_validator_1.check)(field).trim().notEmpty().withMessage(message);
exports.checkExists = checkExists;
/**
 * Creates a validation chain for checking if a field is a valid number.
 * @param field Field to be checked
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
const checkIsNumber = (field, message) => (0, express_validator_1.check)(field).trim().notEmpty().withMessage(message).isNumeric().withMessage(`${field} must be numeric`);
exports.checkIsNumber = checkIsNumber;
/**
 * Creates a validation chain for checking if a field is a valid boolean.
 * @param field Field to be checked
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
const checkIsBoolean = (field, message) => (0, express_validator_1.check)(field).trim().notEmpty().withMessage(message).isBoolean().withMessage(`${field} must be boolean`);
exports.checkIsBoolean = checkIsBoolean;
/**
 * Creates a validation chain for checking if an array is not empty.
 * @param field Field (array) to be checked
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
const checkArrayEmpty = (field, message) => (0, express_validator_1.check)(field).isArray({ min: 1 }).notEmpty().withMessage(message);
exports.checkArrayEmpty = checkArrayEmpty;
/**
 * Creates a validation chain for checking if an array exists (not empty).
 * @param field Field (array) to be checked
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
const checkArray = (field, message) => (0, express_validator_1.check)(field).isArray({ min: 1 }).withMessage(message);
exports.checkArray = checkArray;
/**
 * Creates a validation chain for checking if a field is a valid IP address.
 * @param field Field to be checked
 * @returns Validation chain
 */
const checkIPAddress = (field) => (0, express_validator_1.check)(field).isIP().withMessage("Invalid IP Address");
exports.checkIPAddress = checkIPAddress;
/**
 * Creates a validation chain for checking if a field matches a specified regex pattern.
 * @param field Field to be checked
 * @param regex Regular expression pattern
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
const checkRegex = (field, regex, message) => (0, express_validator_1.check)(field).matches(regex).withMessage(`Invalid ${field} format`);
exports.checkRegex = checkRegex;
/**
 * Creates a validation chain for checking if a field matches a specified code format.
 * @param field Field to be checked
 * @returns Validation chain
 */
const checkCode = (field) => (0, express_validator_1.check)(field)
    .matches(/^[a-zA-Z_0-9]+$/)
    .withMessage(`Invalid ${field} format`);
exports.checkCode = checkCode;
/**
 * Creates a validation chain for checking if a field's value is within a specified set of items.
 * @param field Field to be checked
 * @param items Array of valid items
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
const checkIsIn = (field, items, message) => (0, express_validator_1.check)(field).isIn(items).withMessage(`Invalid ${field}`);
exports.checkIsIn = checkIsIn;
/**
 * Creates a validation chain for checking if a field is a valid date.
 * @param field Field to be checked
 * @param format Date format (e.g., 'YYYY-MM-DD')
 * @param message Custom error message if validation fails
 * @returns Validation chain
 */
const checkIsValidDate = (field, format, message) => (0, express_validator_1.check)(field).trim().notEmpty().withMessage(message).bail().isDate({ format }).withMessage(`Invalid ${field}`);
exports.checkIsValidDate = checkIsValidDate;
