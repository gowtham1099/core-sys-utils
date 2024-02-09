# Node.js Core Utilities

[![npm](https://img.shields.io/npm/v/core-sys-utils.svg?style=flat-square)](https://npmjs.org/package/core-sys-utils)
[![Build Status](https://img.shields.io/github/actions/workflow/status/nodejs/core-sys-utils/nodejs.yml?branch=main&style=flat-square)](https://github.com/gowtham1099/core-sys-utils)
[![codecov](https://img.shields.io/codecov/c/github/nodejs/core-sys-utils.svg?style=flat-square)](https://codecov.io/gh/nodejs/core-sys-utils)
[![Known Vulnerabilities](https://snyk.io/test/github/nodejs/core-sys-utils/badge.svg?style=flat-square)](https://snyk.io/test/github/nodejs/core-sys-utils)

The `core-sys-utils` library exported as `Node.js` Modules.

<!-- TOC -->

-   [Installation](#installation)
    -   [Using NPM](#using-npm)
    -   [Setting up .env file](#setting-up-env)
    -   [In Node.js](#in-node-js)
        -   [Logger](#logger)
        -   [Email Service](#email-service)
        -   [KONG Service](#kong-service)
        -   [JWT Service](#jwt-service)
        -   [S3 Service](#s3-service)
        -   [API Response](#api-response)
        -   [Helpers](#helpers)
    -   [Troubleshooting](#troubleshooting)
-   [Support](#support)
-   [License](#license)

<!-- /TOC -->

## Installation

### Using npm

```sh
npm install core-sys-utils
```

### Setting up .env

Most of the tools need your credentials to work. You can either

```
JWT_SECRET = "SecretKey0123456789XYZ"
AUTH_TOKEN_VALIDITY = "1" // Days

# ================ GOOGLE CLOUD ================== #
GOOGLE_SERVICE_ACCOUNT_EMAIL = "sheets@gserviceaccount.com"
GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n********\n-----END PRIVATE KEY-----\n"

# ================ KONG ADMIN ==================== #
KONG_URL = "http://localhost:8001"

#================ EMAIL CREDENTIALS ============== #
ELASTICEMAIL_USERNAME = "mailer@core.io"
ELASTICEMAIL_API_KEY = ""
ELASTICEMAIL_FROM_NAME = "CORE"

# ================= S3 BUCKET =================== #
S3_SECRET_ACCESS_KEY = "3wecX/pC69EKR"
S3_ACCESS_KEY_ID = "AKIA35WALCHNP5J"
S3_REGION = "ap-south-1"
S3_BUCKET = "core"
S3_VERSION = "v4"
S3_ACL = "public-read"
```

Note: you could use `.env` file to configure these variables.

### In Node.js

Import the package functions and it's usages

#### Logger

```js
// Import logger from package
const { logger } = require("core-sys-utils");

// Call this function for information messages
logger.info(`Your Message`);

// Call this function for exceptions
logger.error(new Error(`Exception`))

/**
 * Capture all api requests and responses
 * from middleware
 */
const app = express();
app.use(logger.captureRequests)
```

#### Email Service

```js
// Import emailService from package
const { emailService } = require("core-sys-utils");

/**
 * Send email
 * @param {*} html // HTML content
 * @param {*} data // HTML template data object
 * @param {*} subject // Email Subject message
 * @param {*} msgTo // Receiver email address
 * @param {*} cc // array of email address to add cc list
 * @param {*} attachment array of files to be attached
 * @returns
 */
emailService.sendEmail(html, data, subject, msgTo, cc, attachment);

```

#### KONG Service

```js
// Import kongService from package
const { kongService } = require("core-sys-utils");
```

#### JWT Service

```js
// Import jwtService from package
const { jwtService } = require("core-sys-utils");

/**
 * Generate JWT Token with expiry
 * @param {*} data
 * @param {*} exp
 * @returns
 */
jwtService.generateToken({sample: "test"}, expTimeStamp)

/**
 * Verify JWT Token
 * @param {*} token
 * @returns
 */
jwtService.verifyToken(token);


```

#### S3 Service

```js
// Import s3Service from package
const { s3Service } = require("core-sys-utils");
```

#### API Response

```js
const { response } = require("core-sys-utils");

/**
 * Success response
 * @param {*} res route response param
 * @param {*} message // string
 * @param {*} data // data object
 * @param {*} code // status code
 */
response.success(res, message, data, code);

/**
 * Failure response
 * @param {*} res route response param
 * @param {*} message // string
 * @param {*} code // status code
 * @param {*} error // error object 
 */
response.failure(res, message, code, error);

/**
 * Crash response
 * @param {*} res route response param
 * @param {*} error // Exception error
 */
response.crash(res, error);

```

#### Helpers

```js
const { helpers } = require("core-sys-utils");
```

### Troubleshooting

If you encounter an error that you cannot fix by yourself, please

1. Make sure you update package to the latest version
2. Try again with the environment variable set and
   open an issue at https://github.com/nodejs/core-sys-utils/issues with
   detailed logs.

### Support

Tested in Chrome 74-75, Firefox 66-67, IE 11, Edge 18, Safari 11-12, & Node.js 8-12.
Automated `browser` & `CI` test runs are available.

## License

MIT. See [LICENSE](./LICENSE).
