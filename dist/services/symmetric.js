"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptRequest = exports.encryptResponse = exports.decrypt = exports.encrypt = exports.createSecretKey = void 0;
/*
 * Created by Gowtham R
 * Created on Thu Feb 01 2024
 * Copyright (c) 2024
 */
const crypto_1 = require("crypto");
/**
 * Create secret key for symmetric algorithms
 * @returns {string} - The generated secret key.
 */
function createSecretKey() {
    const secretKey = (0, crypto_1.randomBytes)(32).toString("hex");
    return secretKey;
}
exports.createSecretKey = createSecretKey;
/**
 * Encrypt data using secret key
 * @param {string} secretKey - The secret key for encryption.
 * @param {string} data - The data to be encrypted.
 * @returns {string | Error} - The encrypted data or an error if encryption fails.
 */
function encrypt(secretKey, data) {
    try {
        const iv = (0, crypto_1.randomBytes)(16);
        const cipher = (0, crypto_1.createCipheriv)("aes-256-cbc", Buffer.from(secretKey, "hex"), iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
    }
    catch (error) {
        throw error;
    }
}
exports.encrypt = encrypt;
/**
 * Decrypt encrypted data using secret key
 * @param {string} secretKey - The secret key for decryption.
 * @param {string} data - The encrypted data to be decrypted.
 * @returns {string | Error} - The decrypted data or an error if decryption fails.
 */
function decrypt(secretKey, data) {
    try {
        const iv = Buffer.from(data?.split(":")?.[0], "hex");
        const encryptedData = Buffer.from(data?.split(":")?.[1], "hex");
        const decipher = (0, crypto_1.createDecipheriv)("aes-256-cbc", Buffer.from(secretKey, "hex"), iv);
        let decrypted = decipher.update(encryptedData);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
    catch (error) {
        throw error;
    }
}
exports.decrypt = decrypt;
/**
 * Middleware to encrypt response data before sending.
 * @param {string} secretKey - The secret key for encryption.
 * @returns {(req: any, res: any, next: () => void) => void} - The middleware function.
 */
function encryptResponse(secretKey) {
    return (req, res, next) => {
        try {
            const originalSend = res.send;
            // Override the send method to encrypt the response
            res.send = function (data) {
                // Convert the response data to a string
                const responseData = JSON.stringify(data);
                const encryptedData = encrypt(secretKey, responseData);
                // Set the encrypted data as the response
                originalSend.call(res, JSON.stringify({ encrypted: encryptedData }));
            };
            next();
        }
        catch (error) {
            next();
        }
    };
}
exports.encryptResponse = encryptResponse;
/**
 * Middleware to decrypt request data before processing.
 * @param {string} secretKey - The secret key for decryption.
 * @returns {(req: any, res: any, next: () => void) => void} - The middleware function.
 */
function decryptRequest(secretKey) {
    return (req, res, next) => {
        try {
            if (req.headers["content-type"] === "application/json" && req.body && req.body.encrypted) {
                req.body = JSON.parse(decrypt(secretKey, req.body.encrypted));
            }
            next();
        }
        catch (error) {
            next();
        }
    };
}
exports.decryptRequest = decryptRequest;
