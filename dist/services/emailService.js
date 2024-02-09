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
exports.sendEmail = void 0;
/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
const fs_1 = require("fs");
const ejs_1 = require("ejs");
const nodelastic_1 = __importDefault(require("nodelastic"));
const logger = __importStar(require("../helpers/logger"));
const config_1 = __importDefault(require("../config/config"));
/**
 * Sends an email using ElasticMail with the provided HTML template, data, subject, recipients, CC list, and attachments.
 * @param html The HTML template for the email.
 * @param data The data to be rendered in the HTML template.
 * @param subject The subject of the email.
 * @param msgTo The primary recipient of the email.
 * @param cc An optional array of CC recipients for the email.
 * @param attachment An optional array of file attachments for the email.
 * @returns A boolean indicating whether the email was sent successfully.
 */
async function sendEmail(html, data, subject, msgTo, cc = [], attachment = []) {
    try {
        // Create an instance of ElasticMail with the API key
        const client = new nodelastic_1.default(config_1.default.EMAIL.API_KEY);
        // Render the HTML content with the provided data
        const htmlContent = (0, ejs_1.render)(html, data);
        // Check if HTML content is generated successfully
        if (!htmlContent)
            return false;
        // Create the email message object
        const message = {
            from: config_1.default.EMAIL.USERNAME,
            fromName: config_1.default.EMAIL.FROM_NAME,
            subject,
            msgTo,
            bodyHtml: htmlContent,
        };
        // Add CC recipients to the message if provided
        if (cc.length > 0)
            message.msgCC = cc;
        // Prepare attachments for the email
        const attachments = attachment.map((item) => ({
            data: (0, fs_1.readFileSync)(`${process.cwd()}/${item.path}`),
            filename: item.originalname,
            contentType: item.mimetype,
        }));
        // Send the email using ElasticMail
        await client.send(message, attachments);
        // Return true indicating successful email sending
        return true;
    }
    catch (error) {
        // Log any errors that occur during email sending
        logger.error(error);
        // Return false indicating failure in email sending
        return false;
    }
}
exports.sendEmail = sendEmail;
