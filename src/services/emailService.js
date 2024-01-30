/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
const fs = require("fs");
const ejs = require("ejs");
const ElasticMail = require("nodelastic");
const { logger } = require("../helpers/logger");
const config = require("../config/config");

/**
 *
 * @param {*} html
 * @param {*} data
 * @param {*} subject
 * @param {*} msgTo
 * @param {*} cc
 * @param {*} attachment
 * @returns
 */
exports.sendEmail = async (html, data, subject, msgTo, cc = [], attachment = []) => {
    try {
        const client = new ElasticMail(config.EMAIL.API_KEY);
        const htmlContent = ejs.render(html, data);
        if (!htmlContent) return false;
        const message = {
            from: config.EMAIL.USERNAME,
            fromName: config.EMAIL.FROM_NAME,
            subject,
            msgTo,
            bodyHtml: htmlContent,
        };

        if (cc) message.msgCC = cc;

        const attachments = [];
        attachment.forEach((item) => {
            const file = {
                data: fs.readFileSync(`${process.cwd()}/${item.path}`),
                filename: item.originalname,
                contentType: item.mimetype,
            };
            attachments.push(file);
        });

        await client.send(message, attachments);
        return true;
    } catch (error) {
        logger.error(error);
        return false;
    }
};
