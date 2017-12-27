import Promise from 'bluebird';
import path from 'path';
import nconf from 'nconf';
const Minio = require('minio');
import settings from '../../config';
let minioClient;

if (settings.s3) {
  minioClient = new Minio.Client({
    endPoint: settings.s3.endPoint,
    secure: settings.s3.secure,
    accessKey: settings.s3.accessKey,
    secretKey: settings.s3.secretKey,
  });
}

export default {
  photo(bucket, fileName, mimeType, data) {
    return minioClient.putObject(
      bucket,
      fileName,
      data,
      data.length,
      mimeType || 'image/jpeg'
    );
  },
};
