"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { env } = process;
const config = {
    JWT_SECRET: env?.JWT_SECRET,
    KONG_URL: env?.KONG_URL,
    AUTH_TOKEN_VALIDITY: env?.AUTH_TOKEN_VALIDITY,
    EMAIL: {
        USERNAME: env?.ELASTICEMAIL_USERNAME,
        API_KEY: env?.ELASTICEMAIL_API_KEY,
        FROM_NAME: env?.ELASTICEMAIL_FROM_NAME,
    },
    GOOGLE_CLOUD: {
        SERVICE_EMAIL: env?.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        PRIVATE_KEY: env?.GOOGLE_PRIVATE_KEY,
    },
    S3: {
        SECRET_ACCESS_KEY: env?.S3_SECRET_ACCESS_KEY,
        ACCESS_KEY_ID: env?.S3_ACCESS_KEY_ID,
        REGION: env?.S3_REGION,
        BUCKET: env?.S3_BUCKET,
        VERSION: env?.S3_VERSION,
        ACL: env?.S3_ACL,
    },
    ELASTIC_SEARCH: {
        IP_ADDRESS: env?.ES_IP_ADDRESS,
        SERVICE_NAME: env?.ES_SERVICE_NAME,
    },
};
exports.default = config;
