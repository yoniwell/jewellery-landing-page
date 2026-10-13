import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.resolve(import.meta.dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Disk Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `gem-${cleanName}-${uniqueSuffix}${ext}`);
  },
});

// File filter for images and videos (supports jpg, jpeg, jpej, png, webp, gif, etc.)
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.jpej', '.png', '.webp', '.gif', '.avif', '.heic', '.mp4', '.webm', '.mov', '.mkv'];

  const allowedMimes = [
    // Images
    'image/jpeg',
    'image/pjpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
    'image/heic',
    'image/x-citrix-jpeg',
    // Videos
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-matroska',
  ];

  const mime = (file.mimetype || '').toLowerCase();
  if (
    allowedMimes.includes(mime) ||
    mime.startsWith('image/') ||
    mime.startsWith('video/') ||
    allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype || ext}. Please upload an image (JPEG/JPG, PNG, WebP) or video file.`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 150 * 1024 * 1024, // 150 MB max for high-res gemological scans and 4K video spins
  },
});

// Single file upload (photo or video)
router.post('/file', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    isVideo: req.file.mimetype.startsWith('video/'),
  });
});

// Multiple files upload (e.g. multi-angle specimen photoshoot)
router.post('/files', upload.array('files', 12), (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const fileData = files.map((f) => ({
    url: `/uploads/${f.filename}`,
    filename: f.filename,
    originalName: f.originalname,
    mimetype: f.mimetype,
    size: f.size,
    isVideo: f.mimetype.startsWith('video/'),
  }));

  return res.json({
    success: true,
    count: fileData.length,
    files: fileData,
    urls: fileData.map((f) => f.url),
  });
});

export default router;
