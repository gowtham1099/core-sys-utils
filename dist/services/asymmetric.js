"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptRequest = exports.encryptResponse = exports.decrypt = exports.encrypt = exports.createKeyPair = void 0;
const crypto_1 = require("crypto");
// Using 'self' to reference the current context
const self = this;
/**
 * Creates a pair of private and public keys for encryption and decryption.
 * @returns An object containing public and private keys.
 */
function createKeyPair() {
    const { publicKey, privateKey } = (0, crypto_1.generateKeyPairSync)("rsa", {
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
}
exports.createKeyPair = createKeyPair;
/**
 * Encrypts data using the provided public key.
 * @param publicKey The public key used for encryption.
 * @param data The data to be encrypted.
 * @returns Encrypted data along with additional information.
 */
function encrypt(publicKey, data) {
    try {
        // Generate a random initialization vector (IV)
        const iv = (0, crypto_1.randomBytes)(16);
        // Generate a random secret key and convert it to hex format
        const secretKey = (0, crypto_1.randomBytes)(32).toString("hex");
        // Encrypt the secret key with the public key and convert it to base64
        const key = (0, crypto_1.publicEncrypt)(publicKey, Buffer.from(secretKey, "hex")).toString("base64");
        // Create a cipher with AES-256-CBC algorithm using the secret key and IV
        const cipher = (0, crypto_1.createCipheriv)("aes-256-cbc", Buffer.from(secretKey, "hex"), iv);
        // Encrypt the data using the cipher
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        // Combine encrypted data, key, and IV as a string
        return `${encrypted.toString("hex")}:${key}:${iv.toString("hex")}`;
    }
    catch (error) {
        throw error;
    }
}
exports.encrypt = encrypt;
/**
 * Decrypts encrypted data using the provided private key.
 * @param privateKey The private key used for decryption.
 * @param data The encrypted data along with additional information.
 * @returns Decrypted data.
 */
function decrypt(privateKey, data) {
    try {
        // Split the encrypted data into parts
        const details = data.split(":");
        if (details.length !== 3)
            throw new Error("Invalid Encryption Data");
        // Decrypt the secret key using the private key and convert it to UTF-8
        const secretKey = (0, crypto_1.privateDecrypt)(privateKey, Buffer.from(details[1], "base64")).toString("utf-8");
        // Extract the IV and encrypted data from the string
        const iv = Buffer.from(details[2], "hex");
        const encryptedData = Buffer.from(details[0], "hex");
        // Create a decipher with AES-256-CBC algorithm using the secret key and IV
        const decipher = (0, crypto_1.createDecipheriv)("aes-256-cbc", Buffer.from(secretKey, "hex"), iv);
        // Decrypt the data using the decipher
        let decrypted = decipher.update(encryptedData);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        // Convert the decrypted data to a string
        return decrypted.toString();
    }
    catch (error) {
        throw error;
    }
}
exports.decrypt = decrypt;
/**
 * Middleware to encrypt the response data before sending it.
 * @param publicKey The public key used for encryption.
 * @returns Express middleware function.
 */
function encryptResponse(publicKey) {
    return (req, res, next) => {
        try {
            // Store the original 'send' method
            const originalSend = res.send;
            // Override the 'send' method to encrypt the response
            res.send = function (data) {
                // Convert the response data to a string
                const responseData = JSON.stringify(data);
                // Encrypt the response data
                const encryptedData = encrypt(publicKey, responseData);
                // Set the encrypted data as the response
                return originalSend.call(res, JSON.stringify({ encrypted: encryptedData }));
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
 * Middleware to decrypt the request data before processing it.
 * @param privateKey The private key used for decryption.
 * @returns Express middleware function.
 */
function decryptRequest(privateKey) {
    return (req, res, next) => {
        try {
            // Check if the request has JSON content type and contains encrypted data
            if (req.headers["content-type"] === "application/json" && req.body && req.body.encrypted) {
                // Decrypt the encrypted data and parse it as JSON
                req.body = JSON.parse(decrypt(privateKey, req.body.encrypted));
            }
            next();
        }
        catch (error) {
            next();
        }
    };
}
exports.decryptRequest = decryptRequest;
