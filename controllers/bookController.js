const fs = require('fs');
const path = require('path');
const multer = require('multer');
const AWS = require('aws-sdk');
const { validationResult } = require('express-validator');
const Book = require('../models/bookModel');
const { S3Customizations } = require('aws-sdk/lib/services/s3');
const { s3, bucketName, s3Url } = require('../config/awsConfig');
require('dotenv').config();

// AWS S3 configuration


// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

const getBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books', error: err.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching book', error: err.message });
  }
};

const createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, author, year } = req.body;
  const coverPage = req.file ? req.file.path : '';

  let imageURL = '';

  // Update fields only if the file is present
  if (coverPage) {
    const coverUrl = `${s3Url}/cover_photos/${req.file.filename}`;
    imageURL = coverUrl;

    const filePath = path.join(__dirname, '../upload/images', req.file.filename);
    const key = `cover_photos/${req.file.filename}`;

    try {
      const fileBuffer = fs.readFileSync(filePath);

      const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ACL: 'public-read',
        ContentType: 'image/jpeg',
      };

      await s3.putObject(params).promise();

      // Delete file from local after successful upload
      fs.unlinkSync(filePath);

    } catch (err) {
      console.error('Error uploading to S3:', err.message, err.code);
      return res.status(500).json({ success: 0, message: 'Error uploading to S3' });
    }
  }

  const book = new Book({ title, author, coverPage: imageURL, year });

  try {
    const createdBook = await book.save();
    res.status(201).json({ message: 'Book Created Successfully', createdBook });
  } catch (err) {
    res.status(500).json({ success: 0, message: 'Error creating book', error: err.message });
  }
}


const updateBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, author, year } = req.body;
  const coverPage = req.file ? req.file.path : '';

  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      book.title = title || book.title;
      book.author = author || book.author;
      book.year = year || book.year;

      if (coverPage) {
        let coverUrl = `${s3Url}/cover_photos/${req.file.filename}`;
        const filePath = path.join(__dirname, '../upload/images', req.file.filename);
        const key = `cover_photos/${req.file.filename}`;

        try {
          const fileBuffer = fs.readFileSync(filePath);

          const params = {
            Bucket: bucketName,
            Key: key,
            Body: fileBuffer,
            ACL: 'public-read',
            ContentType: 'image/jpeg',
          };

          await s3.putObject(params).promise();

          // Delete file from local after successful upload
          fs.unlinkSync(filePath);

          book.coverPage = coverUrl;

        } catch (err) {
          console.error('Error uploading to S3:', err.message, err.code);
          return res.status(500).json({ success: 0, message: 'Error uploading to S3' });
        }
      }

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating book', error: err.message });
  }
}

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      await Book.findByIdAndDelete(req.params.id);
      res.json({ message: 'Book removed' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting book', error: err.message });
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };