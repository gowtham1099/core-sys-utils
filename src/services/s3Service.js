/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const config = require("../config/config");
const utils = require("../helpers/utils");

aws.config.update({
    accessKeyId: config?.S3?.ACCESS_KEY_ID,
    secretAccessKey: config?.S3?.SECRET_ACCESS_KEY,
    region: config?.S3?.REGION,
    signatureVersion: config.S3.VERSION,
});
const s3 = new aws.S3();

/**
 * Upload file to S3 Bucket
 */
exports.uploadFile = multer({
    storage: multerS3({
        s3,
        bucket: config?.S3?.BUCKET,
        acl: config?.S3?.ACL,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key(req, file, cb) {
            const user = utils.getUserDetails(req);
            const ext = file.mimetype.split("/")[1];
            const folder = `core/${user.parent.id}`;
            cb(null, `${folder}/${file.originalname.split(".")[0]}-${Date.now().toString()}.${ext}`);
        },
    }),
    limits: {
        fileSize: 5000000, // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|pdf)$/)) {
            const err = new Error("Please upload a image file");
            err.status = 444;
            return cb(err);
        }
        return cb(undefined, true);
    },
}).single("file");

/**
 *
 * @param {*} key
 * @returns
 */
exports.generateSignedUrl = (key) => {
    try {
        const url = s3.getSignedUrl("getObject", {
            Bucket: config?.S3?.BUCKET,
            Key: key, // filename
            Expires: 1800, // time to expire in seconds
        });
        return url;
    } catch (e) {
        return null;
    }
};
