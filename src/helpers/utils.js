/*
 * Created by Gowtham R
 * Created on Sat Dec 23 2023
 * Copyright (c) 2023
 */
const crypto = require("crypto");
const { customAlphabet } = require("nanoid");
const moment = require("moment-timezone");

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 12);

module.exports = {
    /**
     * Generate random id
     * @returns
     */
    getRandomId: () => nanoid(),

    /**
     * Generate unique account code
     * @param {*} type
     * @returns
     */
    generateAccountCode: (type) => {
        const id = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 1);
        return `${type}${Date.now()}${id()}`;
    },

    /**
     * Generate id based on document count
     * @param {*} model
     * @param {*} query
     * @param {*} type
     * @returns
     */
    generateCountId: async (model, query, type) => {
        const count = await model.countDocuments(query);
        const id = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 3);
        return `${type}${id()}${String(count + 1).padStart(6, 0)}`;
    },

    /**
     * Encrypt the given string
     * @param {*} input
     * @returns
     */
    createHashPwd: (input) => crypto.createHash("sha512").update(input).digest("hex"),

    /**
     * Generate OTP based on length
     * @param {*} length
     * @returns
     */
    generateOTP: (length) => {
        const id = customAlphabet("0123456789", length);
        return id();
    },

    /**
     * Get feature timestamp
     * @param {*} value
     * @param {*} type
     * @returns
     */
    getTimeStamp: (value, type) => moment().add(value, type).unix(),

    /**
     * Generate API Keys
     * @param {*} prefix
     * @param {*} mode
     * @returns
     */
    generateAPIKeys: (prefix, mode) => {
        const secret = `${prefix}_${mode}_${nanoid(18)}`;
        const key = `${prefix}_${mode}_${nanoid(8)}`;
        return { private: secret, public: key };
    },
};
