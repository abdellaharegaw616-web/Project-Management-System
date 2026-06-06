const express = require('express');
const multer = require('multer');
const path = require('path');
const { getConversations, getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// configure multer
const fs = require('fs');
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
// ensure upload directory exists
try {
  fs.mkdirSync(uploadDir, { recursive: true });
} catch (err) {
  console.error('Failed to create uploads directory', err);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random()*1e9)}-${file.originalname.replace(/\s+/g,'_')}`;
    cb(null, unique);
  }
});
const upload = multer({ storage });

router.get('/conversations', protect, getConversations);
router.get('/:id', protect, getMessages);
router.post('/:id', protect, upload.array('files', 5), sendMessage);

module.exports = router;
