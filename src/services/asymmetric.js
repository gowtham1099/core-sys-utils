/*
 * Created by Gowtham R
 * Created on Thu Feb 01 2024
 * Copyright (c) 2024
 */
const crypto = require("crypto");

/**
 * Create Private and public key pair
 * @returns
 */
exports.createKeyPair = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "spki",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
        },
    });
    return { public_key: publicKey, private_key: privateKey };
};

/**
 * Encrypt data using publickey
 * @param {*} publicKey
 * @param {*} data
 * @returns
 */
exports.encrypt = (publicKey, data) => {
    try {
        const iv = crypto.randomBytes(16);
        const secretKey = crypto.randomBytes(32).toString("hex");
        const key = crypto.publicEncrypt(publicKey, secretKey).toString("base64");
        const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(secretKey, "hex"), iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return `${encrypted.toString("hex")}:${key}:${iv.toString("hex")}`;
    } catch (error) {
        return error;
    }
};

/**
 * Decrypt encrypted data using privatekey
 * @param {*} privateKey
 * @param {*} data
 * @returns
 */
exports.decrypt = (privateKey, data) => {
    try {
        const details = data.split(":");
        if (details.length !== 3) return new Error("Invalid Encryption Data");
        const secretKey = crypto.privateDecrypt(privateKey, Buffer.from(details[1], "base64")).toString("utf-8");
        const iv = Buffer.from(details[2], "hex");
        const encryptedData = Buffer.from(details[0], "hex");
        const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(secretKey, "hex"), iv);
        let decrypted = decipher.update(encryptedData);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        return error;
    }
};
