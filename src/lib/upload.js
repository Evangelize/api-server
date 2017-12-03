import Promise from 'bluebird';
import path from 'path';
import nconf from 'nconf';
const Minio = require('minio');
const settings = nconf.argv()
    .env()
    .file({ file: path.join(__dirname, '../../config/settings.json') });
const bucket = 'd38b1cc2d81511e69d1cbb4903068562';
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
  photo(fileName, data) {
    let url;
    return new Promise((resolve, reject) => {
      minioClient.putObject(
        bucket,
        fileName,
        data,
        data.length,
        'image/jpeg',
        (error, etag) => {
          if (error) {
            console.error(error);
            reject(error);
          } else {
            url = `https://${settings.s3.endPoint}/${bucket}/${fileName}`;
            resolve(url);
          }
        }
      );
    });
  },
};
