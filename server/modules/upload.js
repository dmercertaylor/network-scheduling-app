const dotenv = require('dotenv');
const s3 = require('./s3');
dotenv.config();

module.exports = async (fileName, fileContent) => {
    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.BUCKET_NAME || 'dmt-weekend-spike-demo',
        Key: fileName, // File name you want to save as in S3
        Body: fileContent.buffer
    };

    // Uploading files to the bucket
    const upload = s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
    return upload.promise();
};