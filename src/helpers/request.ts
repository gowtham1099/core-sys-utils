/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
import FormData from "form-data";

type FetchResponse<T = any> = {
    status: number;
    data: T;
};

/**
 * Fetch API Response
 * @param {*} url
 * @param {*} method
 * @param {*} body
 * @param {*} headers
 * @param {*} isFormData
 * @returns
 */
const fetchResponse = async <T = any>(
    url: string,
    method: string,
    body: Record<string, any> | FormData = {},
    headers: Record<string, string> = { "Content-Type": "application/json" }
): Promise<FetchResponse<T>> => {
    const options: { method: string; headers: Record<string, string>; body?: string | Buffer } = { method, headers };

    options.headers = {
        ...options.headers,
        "Content-Type": body instanceof FormData ? body.getHeaders()?.["content-type"] ?? headers["Content-Type"] : headers["Content-Type"],
    };

    if (method !== "GET") options.body = body instanceof FormData ? body.getBuffer() : JSON.stringify(body);

    const details = await fetch(url, options);
    const data = await details.json();

    return { status: details.status, data };
};

/**
 * Export API Request based on methods
 */
const apiRequest = {
    get: async <T = any>(url: string, headers?: Record<string, string>): Promise<FetchResponse<T>> => fetchResponse(url, "GET", {}, headers),

    post: async <T = any>(url: string, body: Record<string, any>, headers?: Record<string, string>): Promise<FetchResponse<T>> => fetchResponse(url, "POST", body, headers),

    patch: async <T = any>(url: string, body: Record<string, any>, headers?: Record<string, string>): Promise<FetchResponse<T>> => fetchResponse(url, "PATCH", body, headers),

    put: async <T = any>(url: string, body: Record<string, any>, headers?: Record<string, string>): Promise<FetchResponse<T>> => fetchResponse(url, "PUT", body, headers),

    delete: async <T = any>(url: string, body: Record<string, any>, headers?: Record<string, string>): Promise<FetchResponse<T>> => fetchResponse(url, "DELETE", body, headers),
};

export default apiRequest;
