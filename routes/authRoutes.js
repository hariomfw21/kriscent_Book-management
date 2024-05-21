const express = require('express');
const { register, login } = require('../controllers/authController');
const { check } = require('express-validator');

const router = express.Router();



router.post(
    '/register',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    ],
    register
);

router.post('/login', login);

module.exports = router;
