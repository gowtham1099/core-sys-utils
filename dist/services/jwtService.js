"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../config/config"));
/**
 * Generates a JSON Web Token (JWT) with the provided data, expiration time, and secret.
 *
 * @param {object} data - The data to be included in the JWT payload.
 * @param {number} exp - The expiration time of the JWT in seconds.
 * @param {string} secret - The secret key for signing the JWT. If not provided, it falls back to the default JWT_SECRET from the config.
 * @returns {string} - The generated JWT.
 */
function generateToken(data, exp, secret) {
    return (0, jsonwebtoken_1.sign)({ iss: JSON.stringify(data), exp }, secret ?? config_1.default.JWT_SECRET);
}
exports.generateToken = generateToken;
/**
 * Verifies the authenticity of a JSON Web Token (JWT) and retrieves the data if valid.
 *
 * @param {string} authorization - The JWT to be verified.
 * @returns {object} - An object containing the verification status and the decoded data if the token is valid.
 */
function verifyToken(authorization) {
    try {
        if (!authorization)
            return { status: false };
        // Verify the token and extract the 'iss' (issuer) claim from the payload
        const details = (0, jsonwebtoken_1.verify)(authorization, config_1.default.JWT_SECRET);
        return { status: true, data: JSON.parse(details.iss) };
    }
    catch (error) {
        // Handle token verification errors
        // Check if the error is due to the token being expired
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            // Decode the expired token and extract the 'iss' claim from the payload
            const decodedData = (0, jsonwebtoken_1.decode)(authorization);
            return { status: false, data: JSON.parse(decodedData.iss) };
        }
        else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            // Handle other JWT-related errors (e.g., signature verification failure)
            return { status: false };
        }
        else {
            // Handle unexpected errors
            throw error;
        }
    }
}
exports.verifyToken = verifyToken;
