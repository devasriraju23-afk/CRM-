import multer from 'multer';
import { config } from '../config/env.js';
import { isAllowedMimeType } from '../utils/fileHelpers.js';

const maxSizeBytes = config.upload.maxFileSizeMb * 1024 * 1024;

// Store files in memory so we can forward to any storage provider
const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (isAllowedMimeType(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type not allowed. Allowed types: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, images.`
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSizeBytes },
});

/** Single file under field name "file" */
export const uploadSingle = upload.single('file');

/** Optional thumbnail under field name "thumbnail" */
export const uploadResourceFiles = upload.fields([
  { name: 'file',      maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);
