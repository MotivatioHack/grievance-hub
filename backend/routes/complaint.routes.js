import express from 'express';
import { createComplaint, getComplaintById } from '../controllers/complaint.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for better file handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Define a simple middleware to pass validation results to the controller
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Optional auth middleware
const optionalAuth = (req, res, next) => {
    if (req.headers.authorization) {
        return protect(req, res, next);
    }
    next();
};


router.post(
  '/',
  upload.single('attachment'), // 1. Multer runs first to parse the form data
  optionalAuth,               // 2. Then, we check for authentication
  [                           // 3. Then, we validate the (now populated) req.body
    body('title').not().isEmpty().withMessage('Title is required'),
    body('category').not().isEmpty().withMessage('Category is required'),
    body('description').not().isEmpty().withMessage('Description is required'),
  ],
  handleValidationErrors,     // 4. Handle any validation errors
  createComplaint             // 5. Finally, run the controller
);

router.get('/:id', getComplaintById);

export default router;