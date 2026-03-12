const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controller/uploadController');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB limit for videos
    } 
});

router.post('/', upload.single('file'), uploadController.uploadFile);

module.exports = router;
