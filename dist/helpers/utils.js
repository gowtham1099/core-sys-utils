"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAPIKeys = exports.getTimeStamp = exports.generateOTP = exports.createHashPwd = exports.generateCountId = exports.generateAccountCode = exports.getRandomId = void 0;
/*
 * Created by Gowtham R
 * Created on Sat Dec 23 2023
 * Copyright (c) 2023
 */
const crypto_1 = require("crypto");
const nanoid_1 = require("nanoid");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
// Generate a random ID using custom alphabet
const nanoid = (0, nanoid_1.customAlphabet)("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 12);
/**
 * Generate a random ID of specified length
 * @returns Random ID
 */
const getRandomId = () => {
    return nanoid();
};
exports.getRandomId = getRandomId;
/**
 * Generate an account code based on the provided type
 * @param type Account type
 * @returns Generated account code
 */
const generateAccountCode = (type) => {
    // Generate a single character ID from uppercase alphabet
    const id = (0, nanoid_1.customAlphabet)("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 1);
    return `${type}${Date.now()}${id()}`;
};
exports.generateAccountCode = generateAccountCode;
/**
 * Generate a count-based ID for a model with a specified query and type
 * @param model MongoDB model
 * @param query Query to filter documents
 * @param type Type identifier for the ID
 * @returns Count-based ID
 */
const generateCountId = async (model, query, type) => {
    // Count documents in the model based on the provided query
    const count = await model.countDocuments(query);
    // Generate a three-character ID from uppercase alphabet
    const id = (0, nanoid_1.customAlphabet)("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 3);
    // Combine type, ID, and count with padding
    return `${type}${id()}${String(count + 1).padStart(6, "0")}`;
};
exports.generateCountId = generateCountId;
/**
 * Create a hash of the input using SHA-512 algorithm
 * @param input Input string to hash
 * @returns Hashed string
 */
const createHashPwd = (input) => {
    return (0, crypto_1.createHash)("sha512").update(input).digest("hex");
};
exports.createHashPwd = createHashPwd;
/**
 * Generate a random OTP (One-Time Password) of specified length
 * @param length Length of the OTP
 * @returns Generated OTP
 */
const generateOTP = (length) => {
    // Generate a numeric ID of specified length
    const id = (0, nanoid_1.customAlphabet)("0123456789", length);
    return id();
};
exports.generateOTP = generateOTP;
/**
 * Get a UNIX timestamp based on the current moment plus a specified value and type
 * @param value Time value to add
 * @param type Unit of time (e.g., 'days', 'hours')
 * @returns UNIX timestamp
 */
const getTimeStamp = (value, type) => {
    return (0, moment_timezone_1.default)().add(value, type).unix();
};
exports.getTimeStamp = getTimeStamp;
/**
 * Generate API keys with a specified prefix and mode
 * @param prefix Prefix for the keys
 * @param mode Mode identifier for the keys
 * @returns Object containing private and public keys
 */
const generateAPIKeys = (prefix, mode) => {
    // Generate a random 18-character and 8-character ID for the secret and key, respectively
    const secret = `${prefix}_${mode}_${nanoid(18)}`;
    const key = `${prefix}_${mode}_${nanoid(8)}`;
    return { private: secret, public: key };
};
exports.generateAPIKeys = generateAPIKeys;
