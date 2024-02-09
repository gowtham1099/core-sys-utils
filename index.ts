/*
 * Created by Gowtham R
 * Created on Mon Jan 29 2024
 * Copyright (c) 2024
 */

/**
 * Simplify email sending and management through RESTful API endpoints provided by Express.js.
 *
 * Seamlessly integrate email functionality into your applications and services with minimal effort.
 */
import * as emailService from "./src/services/emailService";

/**
 * The JWT generation method is responsible for creating a secure and digitally signed JWT based on the provided payload and a secret key. JWTs are commonly used for authentication and authorization in web applications.
 *
 * This process involves encoding a set of claims (information about the user or the application) into a JSON object, signing it with a secret key, and then encoding it into a compact, URL-safe string.
 */
import * as jwtService from "./src/services/jwtService";

/**
 * Kong is an open-source API gateway and microservices management layer that enables you to manage, secure, and scale your APIs. Below are descriptions for some key methods and functionalities provided by Kong API Gateway
 *
 * 1. Service Registration
 *
 * 2. Route Configuration
 *
 * 3. Plugin Integration
 *
 * 4. Authentication and Security
 *
 * 5. Monitoring and Analytics
 */
import * as kongService from "./src/services/kongService";

/**
 * 1. S3 Upload File Middleware:
 * Middleware in the context of web development typically refers to software that acts as a bridge between different components of a web application. For S3 file uploads, middleware can be used to handle and process file uploads before they are sent to the storage service. Here's a general overview of the steps involved:

 * File Handling: The middleware intercepts the incoming file upload request and extracts the file data.

 * Validation: Validate the file, ensuring it meets the required criteria (file type, size, etc.).

 * S3 Interaction: Connect to the S3 service and upload the file to the specified bucket.

 * Response Handling: Depending on your application's needs, you might want to handle the S3 response, update your database with file metadata, or perform other tasks.

 * An example might involve using a library like multer in Node.js for handling file uploads and then incorporating logic to interact with the AWS SDK for S3.

 * 2. Generate Signed URL Method:
 * S3 allows you to generate signed URLs to provide temporary, time-limited access to private objects in your bucket. This is often used when you want to control access to files without making them publicly accessible. Here's a breakdown of the process:
 * Authentication: You need to authenticate with your AWS credentials to have the necessary permissions to generate signed URLs.

 * Generate URL: Use the AWS SDK for S3 to generate a signed URL for a specific object in your bucket.

 * Time Limit: Specify an expiration time for the signed URL. After this time, the URL becomes invalid.

 * Use Cases: Signed URLs are useful for scenarios where you want to provide temporary access to private files, such as for downloading a file after a user has authenticated.
 */
import * as s3Service from "./src/services/s3Service";

/**
 * Helpers functions for javascript applications
 */
import * as helpers from "./src/helpers/utils";

/**
 * Client api response formats
 * Success, Failure, Crash methods.
 */
import * as response from "./src/helpers/response";

/**
 * Request method to fetch api response
 */
import * as apiRequest from "./src/helpers/request";

/**
 * This function helps to use mongodb related methods for development faster.
 */
import * as dbUtils from "./src/helpers/mongoDb";

/**
 * 1. Request Logging Middleware
 * This middleware logs information about incoming requests, providing insights into the application's traffic.
 *
 * 2. Info Message Logging
 * This method helps to log info and warning messages
 *
 * 3. Error Message Logging
 * This method helps to log error and exceptions
 */
import * as logger from "./src/helpers/logger";

/**
 * Symmetric encryption and decryption algoriths
 */
import * as symmetric from "./src/services/symmetric";

/**
 * Asymmetric encryption and decryption algoriths
 */
import * as asymmetric from "./src/services/asymmetric";

/**
 * Express middleware validations
 */
import * as validation from "./src/middlewares/validation";

export default { emailService, jwtService, kongService, s3Service, helpers, response, apiRequest, dbUtils, logger, symmetric, asymmetric, validation };