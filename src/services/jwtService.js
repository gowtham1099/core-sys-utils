/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
const jwt = require("jsonwebtoken");
const config = require("../config/config");

/**
 *
 * @param {*} iss
 * @param {*} exp
 * @param {*} secret
 * @returns
 */
exports.generateToken = (iss, exp, secret) => jwt.sign({ iss, exp }, secret ?? config.JWT_SECRET);

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
        return { status: false };
    }
};
