/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
const moment = require("moment-timezone");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const config = require("../config/config");
const { logger } = require("../helpers/logger");
const utils = require("../helpers/utils");
const jwtService = require("./jwtService");

/**
 *
 * @param {*} username
 * @param {*} type
 * @returns
 */
exports.createNewConsumer = async (username, type = "admin") => {
    try {
        const apiResponse = await utils.requestApi(`${config.KONG_URL}/consumers`, "POST", { username: username });
        await this.addAclGroup(username, `${type}-common`);
        return apiResponse.status === 201;
    } catch (error) {
        logger.error(error);
        return false;
    }
};

/**
 *
 * @param {*} username
 * @returns
 */
exports.deleteConsumer = async (username) => {
    try {
        const apiResponse = await fetch(`${config.KONG_URL}/consumers/${username}`, { method: "DELETE" });
        return apiResponse.status === 204;
    } catch (error) {
        logger.error(error);
        return false;
    }
};

/**
 *
 * @param {*} username
 * @returns
 */
exports.generateAuthToken = async (username) => {
    try {
        const apiResponse = await utils.requestApi(`${config.KONG_URL}/consumers/${username}/jwt`, "POST", { key: config.JWT_SECRET });
        if (apiResponse.status !== 201) return false;
        const token = jwtService.generateToken(
            JSON.stringify({ id: apiResponse.data.id.toString() }),
            moment().add(config.AUTH_TOKEN_VALIDITY, "days").unix(),
            apiResponse.data.secret.toString()
        );
        return { token_id: apiResponse.data.id, token };
    } catch (error) {
        logger.error(error);
        return false;
    }
};

/**
 *
 * @param {*} username
 * @param {*} keys
 * @returns
 */
exports.generateBasicAuthToken = async (username, keys) => {
    try {
        const apiResponse = await utils.requestApi(`${config.KONG_URL}/consumers/${username}/basic-auth`, "POST", {
            username: keys.public,
            password: keys.private,
        });
        return apiResponse.status === 201;
    } catch (error) {
        logger.error(error);
        return false;
    }
};

/**
 *
 * @param {*} username
 * @param {*} tokenId
 * @returns
 */
exports.deleteAuthToken = async (username, tokenId) => {
    try {
        const apiResponse = await fetch(`${config.KONG_URL}/consumers/${username}/jwt/${tokenId}`, { method: "DELETE" });
        return apiResponse.status === 204;
    } catch (error) {
        logger.error(error);
        return false;
    }
};

/**
 *
 * @param {*} username
 * @returns
 */
exports.deleteAllAuthToken = async (username) => {
    try {
        const apiResponse = await utils.requestApi(`${config.KONG_URL}/consumers/${username}/jwt`, "GET");
        if (apiResponse.status === 200) {
            const tokens = apiResponse.data?.data ?? [];
            tokens.forEach(async (element) => {
                await this.deleteAuthToken(username, element?.id);
            });
        }
        return true;
    } catch (error) {
        logger.error(error);
        return false;
    }
};

/**
 *
 * @param {*} username
 * @param {*} group
 * @returns
 */
exports.addAclGroup = async (username, group) => {
    try {
        const apiResponse = await utils.requestApi(`${config.KONG_URL}/consumers/${username}/acls`, "POST", { group });
        return apiResponse.status === 201;
    } catch (error) {
        logger.error(error);
        return false;
    }
};

/**
 *
 * @param {*} username
 * @param {*} group
 * @returns
 */
exports.deleteAclGroup = async (username, group) => {
    try {
        const apiResponse = await fetch(`${config.KONG_URL}/consumers/${username}/acls/${group}`, { method: "DELETE" });
        return apiResponse.status === 204;
    } catch (error) {
        logger.error(error);
        return false;
    }
};

/**
 *
 * @param {*} username
 * @returns
 */
exports.deleteAllAclGroup = async (username) => {
    try {
        const apiResponse = await utils.requestApi(`${config.KONG_URL}/consumers/${username}/acls`, "GET");
        if (apiResponse.status === 200) {
            const aclGroups = apiResponse.data?.data ?? [];
            aclGroups.forEach(async (element) => {
                await this.deleteAclGroup(username, element?.id);
            });
        }
        return true;
    } catch (error) {
        logger.error(error);
        return false;
    }
};

/**
 *
 * @param {*} username
 * @param {*} status
 * @param {*} ipAddressList
 * @returns
 */
exports.modifyIPWhiteListPlugin = async (username, status, ipAddressList) => {
    try {
        if (status) {
            await utils.requestApi(`${config.KONG_URL}/consumers/${username}/plugins`, "POST", {
                name: "ip-restriction",
                config: { allow: ipAddressList, status: 403, message: "IP address not allowed." },
            });
        } else {
            const plugins = await utils.requestApi(`${config.KONG_URL}/consumers/${username}/plugins`, "GET");
            plugins.data?.data?.forEach(async (item) => {
                if (item.name === "ip-restriction") await fetch(`${config.KONG_URL}/consumers/${username}/plugins/${item.id}`, { method: "DELETE" });
            });
        }
        return true;
    } catch (error) {
        logger.error(error);
        return false;
    }
};

/**
 *
 * @returns
 */
const deleteAllRoutesAndServices = async () => {
    try {
        const routesResponse = await utils.requestApi(`${config.KONG_URL}/routes`, "GET");
        routesResponse.data?.data?.forEach(async (item) => {
            await fetch(`${config.KONG_URL}/routes/${item.id}`, { method: "DELETE" });
        });
        const serviceResponse = await utils.requestApi(`${config.KONG_URL}/services`, "GET");
        serviceResponse.data?.data?.forEach(async (item) => {
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
const createNewService = async (name, url) => {
    try {
        const apiResponse = await utils.requestApi(`${config.KONG_URL}/services`, "POST", { name, url });
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
const createNewRoute = async (serviceName, path, method) => {
    try {
        const apiResponse = await utils.requestApi(`${config.KONG_URL}/services/${serviceName}/routes`, "POST", {
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
const addPluginsToService = async (serviceName, data) => {
    try {
        const apiResponse = await utils.requestApi(`${config.KONG_URL}/services/${serviceName}/plugins`, "POST", data);
        return apiResponse.status === 201;
    } catch (error) {
        logger.error(error);
        return false;
    }
};

/**
 *
 * @param {*} item
 * @returns
 */
const processRowData = async (item) => {
    if (!item.get("path")) return false;
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
 *
 * @param {*} sheetId
 * @param {*} replaceAll
 */
exports.importFileDataToKong = async (sheetId, replaceAll = true) => {
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
};
