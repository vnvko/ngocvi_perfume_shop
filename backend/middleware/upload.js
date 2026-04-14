// Middleware upload file — multer, lưu vào /uploads, chỉ nhận ảnh
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fieldDirMap = {
      images: 'products',
      logo: 'brands',
      thumbnail: 'blogs',
      image: 'banners',
      avatar: 'avatars',
    };
    const subDir = req.uploadSubDir || fieldDirMap[file.fieldname] || '';
    const dest = path.join(uploadDir, subDir);
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload ảnh (jpg, png, webp, gif)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
});

const REVIEW_MAX = 30 * 1024 * 1024; // 30 MB / file
const reviewStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(uploadDir, 'reviews');
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});

const reviewFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const videoExts = ['.mp4', '.webm', '.mov'];
  const okExt = imageExts.includes(ext) || videoExts.includes(ext);
  const okMime =
    /^image\/(jpeg|jpg|png|webp|gif)$/i.test(file.mimetype) ||
    /^video\/(mp4|webm|quicktime)$/i.test(file.mimetype);
  if (okExt && okMime) cb(null, true);
  else cb(new Error('Chỉ chấp nhận ảnh (jpg, png, webp, gif) hoặc video mp4, webm, mov (tối đa 30MB/file)'));
};

const reviewMedia = multer({
  storage: reviewStorage,
  fileFilter: reviewFileFilter,
  limits: { fileSize: REVIEW_MAX },
});

upload.reviewMedia = reviewMedia;
module.exports = upload;
