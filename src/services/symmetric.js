/*
 * Created by Gowtham R
 * Created on Thu Feb 01 2024
 * Copyright (c) 2024
 */
const crypto = require("crypto");
const constants = require("../helpers/constants");

/**
 * Create secret key for symmetric algorithms
 * @returns
 */
exports.createSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex");
    return secretKey;
};

/**
 * Encrypt data using secret key
 * @param {*} data
 * @param {*} secretKey
 * @returns
 */
exports.encrypt = (secretKey, data) => {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(secretKey, "hex"), iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
    } catch (error) {
        return error;
    }
};

/**
 * Decrypt encrypted data using secret key
 * @param {*} data
 * @param {*} secretKey
 * @returns
 */
exports.decrypt = (secretKey, data) => {
    try {
        const iv = Buffer.from(data?.split(":")?.[0], "hex");
        const encryptedData = Buffer.from(data?.split(":")?.[1], "hex");
        const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(secretKey, "hex"), iv);
        let decrypted = decipher.update(encryptedData);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        return error;
    }
};

exports.encryptResponse = () => (res, req, next) => {
    try {
        let secretKey = constants.secret_key;
        if (!secretKey) {
            constants.secret_key = this.createSecretKey();
            secretKey = constants.secret_key;
        }
        es._send = res.send;
        res.send = (data) => {
            const encryptedData = this.encrypt(secretKey, JSON.stringify(data));
            res._send(encryptedData);
        };
        next();
    } catch (error) {
        next();
    }
};

exports.decryptRequest = () => (res, req, next) => {
    try {
        const secretKey = constants.secret_key;
        let encryptedData = "";

        req.on("data", (chunk) => {
            encryptedData += chunk;
        });

        req.on("end", () => {
            // Decrypt the request body
            req.body = JSON.parse(this.decrypt(secretKey, encryptedData));

            next();
        });
    } catch (error) {
        next();
    }
};