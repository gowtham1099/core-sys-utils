/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
import { Request } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "../config/config";

// Update AWS SDK configuration with S3 credentials
// Create an S3 instance
const s3 = new S3Client({
    region: config?.S3?.REGION as string,
    credentials: {
        accessKeyId: config?.S3?.ACCESS_KEY_ID as string,
        secretAccessKey: config?.S3?.SECRET_ACCESS_KEY as string,
    },
});

type MyCallback = (err: any, result?: any) => void;

/**
 * Multer middleware for file upload to AWS S3.
 */
export const uploadFile = multer({
    storage: multerS3({
        s3,
        bucket: config?.S3?.BUCKET as string,
        acl: config?.S3?.ACL,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req: Request, file: Express.Multer.File, cb: MyCallback) => {
            cb(null, { fieldName: file.fieldname });
        },
        key(req: Request, file: Express.Multer.File, cb: MyCallback) {
            const ext = file.mimetype.split("/")[1];
            const folder = `core`;
            cb(null, `${folder}/${file.originalname.split(".")[0]}-${Date.now().toString()}.${ext}`);
        },
    }),
    limits: {
        fileSize: 5000000, // 1000000 Bytes = 1 MB
    },
    fileFilter(req: Request, file: Express.Multer.File, cb: MyCallback) {
        // Check file extension and allow only specified types
        if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|pdf)$/)) {
            const err = new Error("Please upload an image file or a PDF");
            return cb(err);
        }
        return cb(null, true);
    },
}).single("file");

/**
 * Generates a signed URL for accessing an object in S3.
 * @param {string} key - The key (filename) of the S3 object.
 * @returns {string | null} - The signed URL or null if an error occurs.
 */
export async function generateSignedUrl(key: string): Promise<string | null> {
    try {
        // Create a GetObjectCommand with the necessary parameters
        const getObjectCommand = new GetObjectCommand({
            Bucket: config.S3.BUCKET,
            Key: key,
        });

        // Get the signed URL
        const url = await getSignedUrl(s3, getObjectCommand, { expiresIn: 3600 });
        return url;
    } catch (e) {
        return null;
    }
}
