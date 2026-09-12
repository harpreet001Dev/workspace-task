
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const allowedExtensions = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.csv',
  '.txt',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
]);

const allowedMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/gif',
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${crypto.randomBytes(16).toString('hex')}${ext}`;

    cb(null, filename);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 4,
  },

  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype.toLowerCase();

    if (allowedExtensions.has(ext) || allowedMimeTypes.has(mimeType)) {
      cb(null, true);
      return;
    }

    cb(new Error('Only PDF, Word, Excel, CSV, text, and image files are allowed.'));
  },
});

export default upload;