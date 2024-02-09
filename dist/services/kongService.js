"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importFileDataToKong = exports.modifyIPWhiteListPlugin = exports.deleteAllAclGroup = exports.deleteAclGroup = exports.addAclGroup = exports.deleteAllAuthToken = exports.deleteAuthToken = exports.generateBasicAuthToken = exports.generateAuthToken = exports.deleteConsumer = exports.createNewConsumer = void 0;
/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const google_spreadsheet_1 = require("google-spreadsheet");
const google_auth_library_1 = require("google-auth-library");
const config_1 = __importDefault(require("../config/config"));
const logger = __importStar(require("../helpers/logger"));
const request_1 = __importDefault(require("../helpers/request"));
const jwtService_1 = require("./jwtService");
/**
 * Creates a new consumer in Kong.
 * @param {string} username - The username of the new consumer.
 * @param {string} type - The type of the consumer (default is "admin").
 * @returns {Promise<boolean>} - Returns true if the consumer is created successfully, otherwise false.
 */
async function createNewConsumer(username, type = "admin") {
    try {
        const apiResponse = await request_1.default.post(`${config_1.default.KONG_URL}/consumers`, { username: username });
        await addAclGroup(username, `${type}-common`);
        return apiResponse.status === 201;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
}
exports.createNewConsumer = createNewConsumer;
/**
 * Deletes a consumer in Kong.
 * @param {string} username - The username of the consumer to be deleted.
 * @returns {Promise<boolean>} - Returns true if the consumer is deleted successfully, otherwise false.
 */
async function deleteConsumer(username) {
    try {
        const apiResponse = await fetch(`${config_1.default.KONG_URL}/consumers/${username}`, { method: "DELETE" });
        return apiResponse.status === 204;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
}
exports.deleteConsumer = deleteConsumer;
/**
 * Generates an authentication token for a consumer in Kong.
 * @param {string} username - The username of the consumer.
 * @returns {Promise<{ token_id: string, token: string } | false>} - Returns an object with token information if successful, otherwise false.
 */
async function generateAuthToken(username) {
    try {
        const apiResponse = await request_1.default.post(`${config_1.default.KONG_URL}/consumers/${username}/jwt`, { key: config_1.default.JWT_SECRET });
        if (apiResponse.status !== 201)
            return false;
        const token = (0, jwtService_1.generateToken)({ id: apiResponse.data.id }, (0, moment_timezone_1.default)()
            .add(config_1.default.AUTH_TOKEN_VALIDITY, "days")
            .unix(), apiResponse.data.secret.toString());
        return { token_id: apiResponse.data.id, token };
    }
    catch (error) {
        logger.error(error);
        return false;
    }
}
exports.generateAuthToken = generateAuthToken;
/**
 *
 * @param {*} username
 * @param {*} keys
 * @returns
 */
async function generateBasicAuthToken(username, keys) {
    try {
        const apiResponse = await request_1.default.post(`${config_1.default.KONG_URL}/consumers/${username}/basic-auth`, {
            username: keys.public,
            password: keys.private,
        });
        return apiResponse.status === 201;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
}
exports.generateBasicAuthToken = generateBasicAuthToken;
/**
 *
 * @param {*} username
 * @param {*} tokenId
 * @returns
 */
async function deleteAuthToken(username, tokenId) {
    try {
        const apiResponse = await fetch(`${config_1.default.KONG_URL}/consumers/${username}/jwt/${tokenId}`, { method: "DELETE" });
        return apiResponse.status === 204;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
}
exports.deleteAuthToken = deleteAuthToken;
/**
 *
 * @param {*} username
 * @returns
 */
async function deleteAllAuthToken(username) {
    try {
        const apiResponse = await request_1.default.get(`${config_1.default.KONG_URL}/consumers/${username}/jwt`);
        if (apiResponse.status === 200) {
            const tokens = apiResponse.data?.data ?? [];
            tokens.forEach(async (element) => {
                await deleteAuthToken(username, element.id);
            });
        }
        return true;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
}
exports.deleteAllAuthToken = deleteAllAuthToken;
/**
 *
 * @param {*} username
 * @param {*} group
 * @returns
 */
async function addAclGroup(username, group) {
    try {
        const apiResponse = await request_1.default.post(`${config_1.default.KONG_URL}/consumers/${username}/acls`, { group });
        return apiResponse.status === 201;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
}
exports.addAclGroup = addAclGroup;
/**
 *
 * @param {*} username
 * @param {*} group
 * @returns
 */
async function deleteAclGroup(username, group) {
    try {
        const apiResponse = await fetch(`${config_1.default.KONG_URL}/consumers/${username}/acls/${group}`, { method: "DELETE" });
        return apiResponse.status === 204;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
}
exports.deleteAclGroup = deleteAclGroup;
/**
 *
 * @param {*} username
 * @returns
 */
async function deleteAllAclGroup(username) {
    try {
        const apiResponse = await request_1.default.get(`${config_1.default.KONG_URL}/consumers/${username}/acls`);
        if (apiResponse.status === 200) {
            const aclGroups = apiResponse.data?.data ?? [];
            aclGroups.forEach(async (element) => {
                await deleteAclGroup(username, element.id);
            });
        }
        return true;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
}
exports.deleteAllAclGroup = deleteAllAclGroup;
/**
 *
 * @param {*} username
 * @param {*} status
 * @param {*} ipAddressList
 * @returns
 */
async function modifyIPWhiteListPlugin(username, status, ipAddressList) {
    try {
        if (status) {
            await request_1.default.post(`${config_1.default.KONG_URL}/consumers/${username}/plugins`, {
                name: "ip-restriction",
                config: { allow: ipAddressList, status: 403, message: "IP address not allowed." },
            });
        }
        else {
            const plugins = await request_1.default.get(`${config_1.default.KONG_URL}/consumers/${username}/plugins`);
            plugins.data?.data?.forEach(async (item) => {
                if (item.name === "ip-restriction")
                    await fetch(`${config_1.default.KONG_URL}/consumers/${username}/plugins/${item.id}`, { method: "DELETE" });
            });
        }
        return true;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
}
exports.modifyIPWhiteListPlugin = modifyIPWhiteListPlugin;
/**
 *
 * @returns
 */
const deleteAllRoutesAndServices = async () => {
    try {
        const routesResponse = await request_1.default.get(`${config_1.default.KONG_URL}/routes`);
        routesResponse.data?.data?.forEach(async (item) => {
            await fetch(`${config_1.default.KONG_URL}/routes/${item.id}`, { method: "DELETE" });
        });
        const serviceResponse = await request_1.default.get(`${config_1.default.KONG_URL}/services`);
        serviceResponse.data?.data?.forEach(async (item) => {
            await fetch(`${config_1.default.KONG_URL}/services/${item.id}`, { method: "DELETE" });
        });
        return true;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
};
/**
 *
 * @param {*} name
 * @param {*} url
 * @returns
 */
const createNewService = async (name, url) => {
    try {
        const apiResponse = await request_1.default.post(`${config_1.default.KONG_URL}/services`, { name, url });
        return apiResponse.status === 201;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
};
/**
 *
 * @param {*} serviceName
 * @param {*} path
 * @param {*} method
 * @returns
 */
const createNewRoute = async (serviceName, path, method) => {
    try {
        const apiResponse = await request_1.default.post(`${config_1.default.KONG_URL}/services/${serviceName}/routes`, {
            name: serviceName,
            paths: [path],
            methods: [method.toUpperCase()],
        });
        return apiResponse.status === 201;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
};
/**
 *
 * @param {*} serviceName
 * @param {*} data
 * @returns
 */
const addPluginsToService = async (serviceName, data) => {
    try {
        const apiResponse = await request_1.default.post(`${config_1.default.KONG_URL}/services/${serviceName}/plugins`, data);
        return apiResponse.status === 201;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
};
/**
 * Processes a row of data from a Google Sheets document and performs actions in Kong.
 * @param {Object} item - The row data object from the Google Sheets document.
 * @returns {Promise<boolean>} - Returns true if the processing is successful, otherwise false.
 */
const processRowData = async (item) => {
    // If 'path' is not available, skip processing
    if (!item.get("path"))
        return false;
    // Generate a service name by replacing '/' with '-'
    const serviceName = item.get("path").replaceAll("/", "-");
    // Create New Service
    const serviceCreated = await createNewService(serviceName, `http://${item.get("host")}:${item.get("port")}/api/${item.get("path")}`);
    if (!serviceCreated)
        return false;
    // If Service Created then Create New Route
    const routeCreated = await createNewRoute(serviceName, `/api/v1/${item.get("path")}`, item.get("method"));
    if (!routeCreated)
        return false;
    // If Route Created then add JWT Plugins
    if (item.get("authentication") === "JWT")
        await addPluginsToService(serviceName, { name: "jwt" });
    if (item.get("authentication") === "BASIC-AUTH")
        await addPluginsToService(serviceName, { name: "basic-auth" });
    // If ACL group available then Add ACL Plugin
    if (item.get("linked_group"))
        await addPluginsToService(serviceName, { name: "acl", config: { allow: [item.get("linked_group")] } });
    return true;
};
/**
 * Imports data from a Google Sheets document to Kong.
 * @param {string} sheetId - The ID of the Google Sheets document.
 * @param {boolean} replaceAll - If true, delete all existing routes and services before importing.
 */
async function importFileDataToKong(sheetId, replaceAll = true) {
    try {
        if (replaceAll)
            await deleteAllRoutesAndServices();
        // Initialize auth
        const serviceAccountAuth = new google_auth_library_1.JWT({
            email: config_1.default.GOOGLE_CLOUD.SERVICE_EMAIL,
            key: config_1.default.GOOGLE_CLOUD.PRIVATE_KEY,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
        // Load Google Sheets using credentials
        const doc = new google_spreadsheet_1.GoogleSpreadsheet(sheetId, serviceAccountAuth);
        await doc.loadInfo(); // loads document properties and worksheets
        for (let index = 0; index < doc.sheetCount; index += 1) {
            // Get the first sheet
            const sheet = doc.sheetsByIndex[index];
            // Get all rows from the sheet
            const rows = await sheet.getRows();
            rows.forEach((item) => {
                processRowData(item);
            });
        }
    }
    catch (error) {
        logger.error(error);
    }
}
exports.importFileDataToKong = importFileDataToKong;
