// Xóa file vật lý trong thư mục uploads (bỏ qua URL ngoài hoặc đường dẫn không hợp lệ)
const fs = require('fs');
const path = require('path');

const uploadRoot = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');

function unlinkUploadUrl(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string') return;
  const u = fileUrl.trim();
  if (!u.startsWith('/uploads/')) return;
  const rel = u.replace(/^\/uploads\//, '');
  if (!rel || rel.includes('..')) return;
  const abs = path.join(uploadRoot, rel);
  try {
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch (_) {
    /* ignore */
  }
}

module.exports = { unlinkUploadUrl, uploadRoot };
