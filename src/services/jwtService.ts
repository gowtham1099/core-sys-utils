/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
import { sign, verify, decode, JsonWebTokenError, TokenExpiredError, JwtPayload } from "jsonwebtoken";
import config from "../config/config";

/**
 * Generates a JSON Web Token (JWT) with the provided data, expiration time, and secret.
 *
 * @param {object} data - The data to be included in the JWT payload.
 * @param {number} exp - The expiration time of the JWT in seconds.
 * @param {string} secret - The secret key for signing the JWT. If not provided, it falls back to the default JWT_SECRET from the config.
 * @returns {string} - The generated JWT.
 */
export function generateToken(data: object, exp: number, secret?: string): string {
    return sign({ iss: JSON.stringify(data), exp }, secret ?? (config.JWT_SECRET as string));
}

/**
 * Verifies the authenticity of a JSON Web Token (JWT) and retrieves the data if valid.
 *
 * @param {string} authorization - The JWT to be verified.
 * @returns {object} - An object containing the verification status and the decoded data if the token is valid.
 */
export function verifyToken(authorization: string): { status: boolean; data?: object } {
    try {
        if (!authorization) return { status: false };

        // Verify the token and extract the 'iss' (issuer) claim from the payload
        const details = verify(authorization, config.JWT_SECRET as string) as JwtPayload;

        return { status: true, data: JSON.parse(details.iss as string) };
    } catch (error) {
        // Handle token verification errors

        // Check if the error is due to the token being expired
        if (error instanceof TokenExpiredError) {
            // Decode the expired token and extract the 'iss' claim from the payload
            const decodedData = decode(authorization) as JwtPayload;
            return { status: false, data: JSON.parse(decodedData.iss as string) };
        } else if (error instanceof JsonWebTokenError) {
            // Handle other JWT-related errors (e.g., signature verification failure)
            return { status: false };
        } else {
            // Handle unexpected errors
            throw error;
        }
    }
}
