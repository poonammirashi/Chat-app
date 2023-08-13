const aws = require("aws-sdk");
const fs = require('fs');


exports.uploadFile = async function uploadFile(file) {
    try {
        const s3bucket = new aws.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_SECRET_KEY
        });
        console.log(file.originalname)
        var params = {
            Bucket:process.env.BUCKET_NAME,
          Key:file.originalname,
          Body:file.buffer,
          ContentType : file.mimetype ,
          ACL:'public-read'
        }
        return new Promise((resolve, reject) => {
            s3bucket.upload(params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.Location);
                }
            })
        })

    } catch (err) {
        console.log(err);

    }
}