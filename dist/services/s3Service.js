"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSignedUrl = exports.uploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const config_1 = __importDefault(require("../config/config"));
// Update AWS SDK configuration with S3 credentials
// Create an S3 instance
const s3 = new client_s3_1.S3Client({
    region: config_1.default?.S3?.REGION,
    credentials: {
        accessKeyId: config_1.default?.S3?.ACCESS_KEY_ID,
        secretAccessKey: config_1.default?.S3?.SECRET_ACCESS_KEY,
    },
});
/**
 * Multer middleware for file upload to AWS S3.
 */
exports.uploadFile = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3,
        bucket: config_1.default?.S3?.BUCKET,
        acl: config_1.default?.S3?.ACL,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key(req, file, cb) {
            const ext = file.mimetype.split("/")[1];
            const folder = `core`;
            cb(null, `${folder}/${file.originalname.split(".")[0]}-${Date.now().toString()}.${ext}`);
        },
    }),
    limits: {
        fileSize: 5000000, // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
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
async function generateSignedUrl(key) {
    try {
        // Create a GetObjectCommand with the necessary parameters
        const getObjectCommand = new client_s3_1.GetObjectCommand({
            Bucket: config_1.default.S3.BUCKET,
            Key: key,
        });
        // Get the signed URL
        const url = await (0, s3_request_presigner_1.getSignedUrl)(s3, getObjectCommand, { expiresIn: 3600 });
        return url;
    }
    catch (e) {
        return null;
    }
}
exports.generateSignedUrl = generateSignedUrl;
