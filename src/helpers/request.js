/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */

/**
 * Fetch API Response
 * @param {*} url
 * @param {*} method
 * @param {*} body
 * @param {*} headers
 * @param {*} isFormData
 * @returns
 */
const fetchResponse = async (url, method, body = {}, headers = { "Content-Type": "application/json" }, isFormData = false) => {
    const options = { method, headers };
    if (method !== "GET" && !isFormData) options.body = JSON.stringify(body);
    if (isFormData) {
        options.headers["Content-Type"] = body?.getHeaders()?.["content-type"] ?? headers["Content-Type"];
        options.body = await body.getBuffer();
    }
    const details = await fetch(url, options);
    const data = await details.json();
    return { status: details.status, data };
};

/**
 * Export API Request based on methods
 */
module.exports = {
    get: async (url, headers) => fetchResponse(url, "GET", {}, headers),
    post: async (url, body, headers) => fetchResponse(url, "POST", body, headers),
    patch: async (url, body, headers) => fetchResponse(url, "PATCH", body, headers),
    put: async (url, body, headers) => fetchResponse(url, "PUT", body, headers),
    delete: async (url, body, headers) => fetchResponse(url, "DELETE", body, headers),
    postFormData: async (url, body, headers) => fetchResponse(url, "POST", body, headers, true),
};
