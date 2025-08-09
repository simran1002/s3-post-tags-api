const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter
});

const requiredEnvVars = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'AWS_S3_BUCKET_NAME'
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`FATAL: Missing required environment variable: ${key}`);
  }
});

const uploadToS3 = async (fileBuffer, fileName, mimeType) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `posts/${Date.now()}-${fileName}`,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: 'public-read'
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    if (error.code === 'AccessDenied') {
      console.error('S3 upload error: Access Denied. Please check your IAM permissions and bucket policy.');
      throw new Error('S3 Access Denied: Check your AWS permissions and bucket policy.');
    }
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload image to S3');
  }
};

const deleteFromS3 = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    const key = fileUrl.split('.com/')[1];
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    if (error.code === 'AccessDenied') {
      console.error('S3 delete error: Access Denied. Please check your IAM permissions and bucket policy.');
      return;
    }
    console.error('S3 delete error:', error);
  }
};

module.exports = {
  upload,
  uploadToS3,
  deleteFromS3
}; 