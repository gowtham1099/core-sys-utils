/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
import moment from "moment-timezone";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import config from "../config/config";
import * as logger from "../helpers/logger";
import apiRequest from "../helpers/request";
import { generateToken } from "./jwtService";

/**
 * Creates a new consumer in Kong.
 * @param {string} username - The username of the new consumer.
 * @param {string} type - The type of the consumer (default is "admin").
 * @returns {Promise<boolean>} - Returns true if the consumer is created successfully, otherwise false.
 */
export async function createNewConsumer(username: string, type: string = "admin") {
    try {
        const apiResponse = await apiRequest.post(`${config.KONG_URL}/consumers`, { username: username });
        await addAclGroup(username, `${type}-common`);
        return apiResponse.status === 201;
    } catch (error) {
        logger.error(error);
        return false;
    }
}

/**
 * Deletes a consumer in Kong.
 * @param {string} username - The username of the consumer to be deleted.
 * @returns {Promise<boolean>} - Returns true if the consumer is deleted successfully, otherwise false.
 */
export async function deleteConsumer(username: string) {
    try {
        const apiResponse = await fetch(`${config.KONG_URL}/consumers/${username}`, { method: "DELETE" });
        return apiResponse.status === 204;
    } catch (error) {
        logger.error(error);
        return false;
    }
}

/**
 * Generates an authentication token for a consumer in Kong.
 * @param {string} username - The username of the consumer.
 * @returns {Promise<{ token_id: string, token: string } | false>} - Returns an object with token information if successful, otherwise false.
 */
export async function generateAuthToken(username: string) {
    try {
        const apiResponse = await apiRequest.post(`${config.KONG_URL}/consumers/${username}/jwt`, { key: config.JWT_SECRET });
        if (apiResponse.status !== 201) return false;
        const token = generateToken(
            { id: apiResponse.data.id },
            moment()
                .add(config.AUTH_TOKEN_VALIDITY as string, "days")
                .unix(),
            apiResponse.data.secret.toString()
        );
        return { token_id: apiResponse.data.id, token };
    } catch (error) {
        logger.error(error);
        return false;
    }
}

/**
 *
 * @param {*} username
 * @param {*} keys
 * @returns
 */
export async function generateBasicAuthToken(username: string, keys: { private: string; public: string }) {
    try {
        const apiResponse = await apiRequest.post(`${config.KONG_URL}/consumers/${username}/basic-auth`, {
            username: keys.public,
            password: keys.private,
        });
        return apiResponse.status === 201;
    } catch (error) {
        logger.error(error);
        return false;
    }
}

/**
 *
 * @param {*} username
 * @param {*} tokenId
 * @returns
 */
export async function deleteAuthToken(username: string, tokenId: string) {
    try {
        const apiResponse = await fetch(`${config.KONG_URL}/consumers/${username}/jwt/${tokenId}`, { method: "DELETE" });
        return apiResponse.status === 204;
    } catch (error) {
        logger.error(error);
        return false;
    }
}

/**
 *
 * @param {*} username
 * @returns
 */
export async function deleteAllAuthToken(username: string) {
    try {
        const apiResponse = await apiRequest.get(`${config.KONG_URL}/consumers/${username}/jwt`);
        if (apiResponse.status === 200) {
            const tokens = apiResponse.data?.data ?? [];
            tokens.forEach(async (element: { id: string }) => {
                await deleteAuthToken(username, element.id);
            });
        }
        return true;
    } catch (error) {
        logger.error(error);
        return false;
    }
}

/**
 *
 * @param {*} username
 * @param {*} group
 * @returns
 */
export async function addAclGroup(username: string, group: string) {
    try {
        const apiResponse = await apiRequest.post(`${config.KONG_URL}/consumers/${username}/acls`, { group });
        return apiResponse.status === 201;
    } catch (error) {
        logger.error(error);
        return false;
    }
}

/**
 *
 * @param {*} username
 * @param {*} group
 * @returns
 */
export async function deleteAclGroup(username: string, group: string) {
    try {
        const apiResponse = await fetch(`${config.KONG_URL}/consumers/${username}/acls/${group}`, { method: "DELETE" });
        return apiResponse.status === 204;
    } catch (error) {
        logger.error(error);
        return false;
    }
}

/**
 *
 * @param {*} username
 * @returns
 */
export async function deleteAllAclGroup(username: string) {
    try {
        const apiResponse = await apiRequest.get(`${config.KONG_URL}/consumers/${username}/acls`);
        if (apiResponse.status === 200) {
            const aclGroups = apiResponse.data?.data ?? [];
            aclGroups.forEach(async (element: { id: string }) => {
                await deleteAclGroup(username, element.id);
            });
        }
        return true;
    } catch (error) {
        logger.error(error);
        return false;
    }
}

/**
 *
 * @param {*} username
 * @param {*} status
 * @param {*} ipAddressList
 * @returns
 */
export async function modifyIPWhiteListPlugin(username: string, status: boolean, ipAddressList: object) {
    try {
        if (status) {
            await apiRequest.post(`${config.KONG_URL}/consumers/${username}/plugins`, {
                name: "ip-restriction",
                config: { allow: ipAddressList, status: 403, message: "IP address not allowed." },
            });
        } else {
            const plugins = await apiRequest.get(`${config.KONG_URL}/consumers/${username}/plugins`);
            plugins.data?.data?.forEach(async (item: { id: string; name: string }) => {
                if (item.name === "ip-restriction") await fetch(`${config.KONG_URL}/consumers/${username}/plugins/${item.id}`, { method: "DELETE" });
            });
        }
        return true;
    } catch (error) {
        logger.error(error);
        return false;
    }
}

/**
 *
 * @returns
 */
const deleteAllRoutesAndServices = async () => {
    try {
        const routesResponse = await apiRequest.get(`${config.KONG_URL}/routes`);
        routesResponse.data?.data?.forEach(async (item: { id: string }) => {
            await fetch(`${config.KONG_URL}/routes/${item.id}`, { method: "DELETE" });
        });
        const serviceResponse = await apiRequest.get(`${config.KONG_URL}/services`);
        serviceResponse.data?.data?.forEach(async (item: { id: string }) => {
            await fetch(`${config.KONG_URL}/services/${item.id}`, { method: "DELETE" });
        });
        return true;
    } catch (error) {
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
const createNewService = async (name: string, url: string) => {
    try {
        const apiResponse = await apiRequest.post(`${config.KONG_URL}/services`, { name, url });
        return apiResponse.status === 201;
    } catch (error) {
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
const createNewRoute = async (serviceName: string, path: string, method: string) => {
    try {
        const apiResponse = await apiRequest.post(`${config.KONG_URL}/services/${serviceName}/routes`, {
            name: serviceName,
            paths: [path],
            methods: [method.toUpperCase()],
        });
        return apiResponse.status === 201;
    } catch (error) {
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
const addPluginsToService = async (serviceName: string, data: object) => {
    try {
        const apiResponse = await apiRequest.post(`${config.KONG_URL}/services/${serviceName}/plugins`, data);
        return apiResponse.status === 201;
    } catch (error) {
        logger.error(error);
        return false;
    }
};

/**
 * Processes a row of data from a Google Sheets document and performs actions in Kong.
 * @param {Object} item - The row data object from the Google Sheets document.
 * @returns {Promise<boolean>} - Returns true if the processing is successful, otherwise false.
 */
const processRowData = async (item: any): Promise<boolean> => {
    // If 'path' is not available, skip processing
    if (!item.get("path")) return false;

    // Generate a service name by replacing '/' with '-'
    const serviceName = item.get("path").replaceAll("/", "-");

    // Create New Service
    const serviceCreated = await createNewService(serviceName, `http://${item.get("host")}:${item.get("port")}/api/${item.get("path")}`);
    if (!serviceCreated) return false;

    // If Service Created then Create New Route
    const routeCreated = await createNewRoute(serviceName, `/api/v1/${item.get("path")}`, item.get("method"));
    if (!routeCreated) return false;

    // If Route Created then add JWT Plugins
    if (item.get("authentication") === "JWT") await addPluginsToService(serviceName, { name: "jwt" });
    if (item.get("authentication") === "BASIC-AUTH") await addPluginsToService(serviceName, { name: "basic-auth" });

    // If ACL group available then Add ACL Plugin
    if (item.get("linked_group")) await addPluginsToService(serviceName, { name: "acl", config: { allow: [item.get("linked_group")] } });

    return true;
};

/**
 * Imports data from a Google Sheets document to Kong.
 * @param {string} sheetId - The ID of the Google Sheets document.
 * @param {boolean} replaceAll - If true, delete all existing routes and services before importing.
 */
export async function importFileDataToKong(sheetId: string, replaceAll: boolean = true) {
    try {
        if (replaceAll) await deleteAllRoutesAndServices();

        // Initialize auth
        const serviceAccountAuth = new JWT({
            email: config.GOOGLE_CLOUD.SERVICE_EMAIL,
            key: config.GOOGLE_CLOUD.PRIVATE_KEY,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        // Load Google Sheets using credentials
        const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
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
    } catch (error) {
        logger.error(error);
    }
}
