require("dotenv").config();
let AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    endpoint: new AWS.Endpoint('https://blr1.digitaloceanspaces.com'),
    region: process.env.REGION
});

let s3 = new AWS.S3({
    params: { Bucket: process.env.BUCKET_NAME },
    s3ForcePathStyle: true
});

const bucketName = process.env.BUCKET_NAME;
const s3Url = process.env.S3URL;

module.exports = { s3, bucketName, s3Url };
