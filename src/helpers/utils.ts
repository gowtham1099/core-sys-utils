/*
 * Created by Gowtham R
 * Created on Sat Dec 23 2023
 * Copyright (c) 2023
 */
import { createHash } from "crypto";
import { customAlphabet } from "nanoid";
import moment from "moment-timezone";
import { Document, Model } from "mongoose";

// Generate a random ID using custom alphabet
const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 12);

/**
 * Generate a random ID of specified length
 * @returns Random ID
 */
export const getRandomId = (): string => {
    return nanoid();
};

/**
 * Generate an account code based on the provided type
 * @param type Account type
 * @returns Generated account code
 */
export const generateAccountCode = (type: string): string => {
    // Generate a single character ID from uppercase alphabet
    const id = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 1);
    return `${type}${Date.now()}${id()}`;
};

/**
 * Generate a count-based ID for a model with a specified query and type
 * @param model MongoDB model
 * @param query Query to filter documents
 * @param type Type identifier for the ID
 * @returns Count-based ID
 */
export const generateCountId = async <T extends Document>(model: Model<T>, query: Record<string, any>, type: string): Promise<string> => {
    // Count documents in the model based on the provided query
    const count = await model.countDocuments(query);
    // Generate a three-character ID from uppercase alphabet
    const id = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 3);
    // Combine type, ID, and count with padding
    return `${type}${id()}${String(count + 1).padStart(6, "0")}`;
};

/**
 * Create a hash of the input using SHA-512 algorithm
 * @param input Input string to hash
 * @returns Hashed string
 */
export const createHashPwd = (input: string): string => {
    return createHash("sha512").update(input).digest("hex");
};

/**
 * Generate a random OTP (One-Time Password) of specified length
 * @param length Length of the OTP
 * @returns Generated OTP
 */
export const generateOTP = (length: number): string => {
    // Generate a numeric ID of specified length
    const id = customAlphabet("0123456789", length);
    return id();
};

/**
 * Get a UNIX timestamp based on the current moment plus a specified value and type
 * @param value Time value to add
 * @param type Unit of time (e.g., 'days', 'hours')
 * @returns UNIX timestamp
 */
export const getTimeStamp = (value: number, type: moment.unitOfTime.DurationConstructor): number => {
    return moment().add(value, type).unix();
};

/**
 * Generate API keys with a specified prefix and mode
 * @param prefix Prefix for the keys
 * @param mode Mode identifier for the keys
 * @returns Object containing private and public keys
 */
export const generateAPIKeys = (prefix: string, mode: string): { private: string; public: string } => {
    // Generate a random 18-character and 8-character ID for the secret and key, respectively
    const secret = `${prefix}_${mode}_${nanoid(18)}`;
    const key = `${prefix}_${mode}_${nanoid(8)}`;
    return { private: secret, public: key };
};
