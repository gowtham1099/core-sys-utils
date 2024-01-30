/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
const jwt = require("jsonwebtoken");
const config = require("../config/config");

/**
 *
 * @param {*} data
 * @param {*} exp
 * @param {*} secret
 * @returns
 */
exports.generateToken = (data, exp, secret) => jwt.sign({ iss: data, exp }, secret ?? config.JWT_SECRET);

/**
 *
 * @param {*} authorization
 * @returns
 */
exports.verifyToken = (authorization) => {
    try {
        if (!authorization) return { status: false };
        const details = jwt.verify(authorization, config.JWT_SECRET)?.iss;
        return { status: true, data: JSON.parse(details) };
    } catch (error) {
        if (error.name !== "TokenExpiredError") return { status: false };
        const details = jwt.decode(authorization)?.iss;
        return { status: false, data: JSON.parse(details) };
    }
};
