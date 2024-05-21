const express = require('express');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const { authenticateToken, authorize } = require('../middlewares/authMiddleware');
const { check } = require('express-validator');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();


router.route('/')
  .get(authenticateToken, authorize(['Admin', 'Author', 'Reader']), getBooks)
  .post(
    authenticateToken,
    upload.single("coverPage"),
    authorize(['Admin', 'Author']),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('author', 'Author is required').not().isEmpty(),
    ],
    createBook
  );

router.route('/:id')
  .get(authenticateToken, authorize(['Admin', 'Author', 'Reader']), getBookById)
  .put(
    authenticateToken,
    upload.single("coverPage"),
    authorize(['Admin', 'Author']),
    [
      check('title').optional().not().isEmpty().withMessage('Title is required if provided'),
      check('author').optional().not().isEmpty().withMessage('Author is required if provided')
    ],
    updateBook
  )
  .delete(authenticateToken, authorize(['Admin']), deleteBook);

module.exports = router;
