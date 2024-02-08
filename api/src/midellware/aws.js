const AWS = require("aws-sdk");
const fs = require("fs");
const { delete_images } = require("../helpers/delete_images");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

const s3 = new AWS.S3();

const upload_s3 = (files, folder) => {
  const promises = [];

  files.forEach((file) => {
    const fileStream = fs.createReadStream(file.path);

    const params = {
      Body: fileStream,
      Bucket: `${process.env.AWS_BUCKET_NAME}/${folder}/${file.fieldname}`,
      Key: file.filename,
    };

    promises.push(s3.upload(params).promise());
  });

  return Promise.all(promises);
};

exports.aws_files_upload = async (req, res, next) => {
  const { folder } = req.body;

  const files = req.files;

  try {
    const data = [];
    const aws = {};

    for (const property in files) {
      data.push(files[property][0]);
    }

    const response = await upload_s3(data, folder);

    for (let i = 0; i < response.length; i++) {
      const name = response[i].Key.split("/")[1];
      aws[name] = response[i];
    }

    req.aws = aws;
    delete_images(files);

    next();
  } catch (error) {
    next(error);
  }
};

exports.aws_get_files = async (req, res, next) => {
  const { key } = req.query;
  const { key_aws } = req.body;

  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key || key_aws,
    };

    const data = await s3.getObject(params).promise();

    req.aws = { file: data };
    next();
  } catch (err) {
    next(err);
  }
};
