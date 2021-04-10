const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/async');
const { loginAuthor } = require('../model/authorModel');
const { authorLoginValidation } = require('../utils/validation');
const { responseMessage, responseError } = require('../utils/responseHandler');

router.post('/login', asyncHandler(async (req, res) => {
    const data = req.body;

    const validateError = authorLoginValidation(data);
    if (validateError) return responseError(res, 400, validateError, 'Bad Request');

    const getOneAuthor = await loginAuthor(data)
    if(getOneAuthor.length === 0) return responseMessage(res, 401, "Wrong Username / Password")

    const author = getOneAuthor[0].name

    jwt.sign({ author: author }, "rahasia", (err, token) => {
        res.json({token : token})
    })
}));

module.exports = router