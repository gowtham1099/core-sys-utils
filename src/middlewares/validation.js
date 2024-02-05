/*
 * Created by Gowtham R
 * Created on Mon Feb 05 2024
 * Copyright (c) 2024
 */

const { validationResult, check } = require("express-validator");
const response = require("../helpers/response");

exports.handleResult = (req, res, next) => {
    const hasErrors = validationResult(req);
    if (!hasErrors.isEmpty()) return response.failure(res, hasErrors.errors[0].msg, 400);
    return next();
};

exports.checkEmail = (field, message) => check(field).trim().notEmpty().withMessage(message).isEmail().withMessage(`Invalid ${field}`);

exports.checkMobilePhone = (field, message) => check(field).trim().notEmpty().withMessage(message).isMobilePhone().withMessage(`Invalid ${field}`);

exports.checkExists = (field, message) => check(field).trim().notEmpty().withMessage(message);

exports.checkIsNumber = (field, message) => check(field).trim().notEmpty().withMessage(message).isNumeric().withMessage(`${field} must be numeric`);

exports.checkIsBoolean = (field, message) => check(field).trim().notEmpty().withMessage(message).isBoolean().withMessage(`${field} must be boolean`);

exports.checkArrayEmpty = (field, message) => check(field).isArray({ min: 1 }).notEmpty().withMessage(message);

exports.checkArray = (field, message) => check(field).isArray({ min: 1 }).withMessage(message);

exports.checkIPAddress = (field) => check(field).isIP().withMessage("Invalid IP Address");

exports.checkRegex = (field, regex, message) => check(field).matches(regex).withMessage(`Invalid ${field} format`);

exports.checkCode = (field) =>
    check(field)
        .matches(/^[a-zA-Z_0-9]+$/)
        .withMessage(`Invalid ${field} format`);

exports.checkIsIn = (field, items, message) => check(field).isIn(items).withMessage(`Invalid ${field}`);

exports.checkIsValidDate = (field, format, message) => check(field).trim().notEmpty().withMessage(message).bail().isDate({ format }).withMessage(`Invalid ${field}`);
