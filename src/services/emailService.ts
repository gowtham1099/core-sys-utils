/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
import { readFileSync } from "fs";
import { render } from "ejs";
import ElasticMail from "nodelastic";
import * as logger from "../helpers/logger";
import config from "../config/config";

interface Message {
    from: string;
    fromName: string;
    subject: string;
    msgTo: string;
    bodyHtml: string;
    msgCC?: string[];
}

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
export async function sendEmail(
    html: string,
    data: Record<string, any>,
    subject: string,
    msgTo: string,
    cc: string[] = [],
    attachment: { path: string; originalname: string; mimetype: string }[] = []
): Promise<boolean> {
    try {
        // Create an instance of ElasticMail with the API key
        const client = new ElasticMail(config.EMAIL.API_KEY);

        // Render the HTML content with the provided data
        const htmlContent = render(html, data);

        // Check if HTML content is generated successfully
        if (!htmlContent) return false;

        // Create the email message object
        const message: Message = {
            from: config.EMAIL.USERNAME as string,
            fromName: config.EMAIL.FROM_NAME as string,
            subject,
            msgTo,
            bodyHtml: htmlContent,
        };

        // Add CC recipients to the message if provided
        if (cc.length > 0) message.msgCC = cc;

        // Prepare attachments for the email
        const attachments = attachment.map((item) => ({
            data: readFileSync(`${process.cwd()}/${item.path}`),
            filename: item.originalname,
            contentType: item.mimetype,
        }));

        // Send the email using ElasticMail
        await client.send(message, attachments);

        // Return true indicating successful email sending
        return true;
    } catch (error) {
        // Log any errors that occur during email sending
        logger.error(error);
        // Return false indicating failure in email sending
        return false;
    }
}
