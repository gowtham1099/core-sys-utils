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
const form_data_1 = __importDefault(require("form-data"));
/**
 * Fetch API Response
 * @param {*} url
 * @param {*} method
 * @param {*} body
 * @param {*} headers
 * @param {*} isFormData
 * @returns
 */
const fetchResponse = async (url, method, body = {}, headers = { "Content-Type": "application/json" }) => {
    const options = { method, headers };
    options.headers = {
        ...options.headers,
        "Content-Type": body instanceof form_data_1.default ? body.getHeaders()?.["content-type"] ?? headers["Content-Type"] : headers["Content-Type"],
    };
    if (method !== "GET")
        options.body = body instanceof form_data_1.default ? body.getBuffer() : JSON.stringify(body);
    const details = await fetch(url, options);
    const data = await details.json();
    return { status: details.status, data };
};
/**
 * Export API Request based on methods
 */
const apiRequest = {
    get: async (url, headers) => fetchResponse(url, "GET", {}, headers),
    post: async (url, body, headers) => fetchResponse(url, "POST", body, headers),
    patch: async (url, body, headers) => fetchResponse(url, "PATCH", body, headers),
    put: async (url, body, headers) => fetchResponse(url, "PUT", body, headers),
    delete: async (url, body, headers) => fetchResponse(url, "DELETE", body, headers),
};
exports.default = apiRequest;
