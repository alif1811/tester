const express = require('express');
const router = express.Router();
const { bookValidation } = require('../utils/validation');
const asyncHandler = require('../middleware/async');
const tokenHandler = require('../middleware/tokenValidation')
const { uploadValidation } = require('../utils/fileUpload')
const fs = require('fs')

const {
  readBooks,
  readOneBook,
  createBook,
  updateBook,
  deleteBook,
} = require('../model/bookModel');

const {
  responseData,
  responseMessage,
  responseError,
} = require('../utils/responseHandler');


// Get Books
router.get('/read', asyncHandler(async (req, res) => {
    const dataBook = await readBooks();
    responseData(res, 200, dataBook);
  })
);

// Get One Book
router.get('/read/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const oneBook = await readOneBook(id);

  if(oneBook.length === 0) 
    return responseMessage(res, 400, `Book with id ${id} not found!`);
  
  responseData(res, 200, oneBook)
}))

// Create Book
router.post('/create', tokenHandler, asyncHandler(async (req, res) => {
  const data = req.body;
  const file = req.files;

  const validateError = bookValidation(data);
  if (validateError)
    return responseError(res, 400, validateError, 'Bad Request');
  
  if(file === null || !file.cover) return responseMessage(res, 400, "Cover can't be blank");

  const fileValidation = uploadValidation(file.cover);
  if(fileValidation.success === false) responseMessage(res, 400, fileValidation.result);

  const newFilePath = `img/${fileValidation.result}`
  const filePath = `${__dirname}/../public/`

  data.cover = newFilePath
  data.author = req.authData.author

  // Upload File
  file.cover.mv(`${filePath}${newFilePath}`, err => {
    if(err) return responseMessage(res, 400, err)
  })

  const newBook = await createBook(data);
  if(newBook.affectedRows > 0) 
    responseMessage(res, 201, `Success created book with id ${newBook.insertId}`)
}));

// Update Book
router.put('/update/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const file = req.files

  const validateError = bookValidation(data);
  if (validateError)
    return responseError(res, 400, validateError, 'Bad Request');

  const checkExist = await readOneBook(id);
  if(checkExist.length === 0) 
    return responseMessage(res, 404, `Book with id ${id} not found!`)

  if(file != null){
    const fileValidation = uploadValidation(file.cover);
    if(fileValidation.success === false) return responseMessage(res, 400, fileValidation.result);

    const newFilePath = `img/${fileValidation.result}`
    const filePath = `${__dirname}/../public/`

    data.cover = newFilePath
    file.cover.mv(`${filePath}${newFilePath}`, err => {
      if(err) return responseMessage(res, 400, err)
    })

    if(fs.existsSync(`${filePath}${checkExist[0].cover}`)){
      fs.unlink(`${filePath}${checkExist[0].cover}`, err => {
        if(err) return responseMessage(res, 500, "Application Crash")
      })
    }
  }

  const isUpdateBook = await updateBook(id, data);
  if(isUpdateBook.changedRows > 0) 
    responseMessage(res, 200, `Success update book with id ${id}`)
}));

// Delete Book
router.delete('/delete/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;

  const checkExist = await readOneBook(id);
  if(checkExist.length === 0) 
    return responseMessage(res, 404, `Book with id ${id} not found!`)

  const isDeleteBook = await deleteBook(id);
  if(isDeleteBook.affectedRows > 0) 
    responseMessage(res, 200, `Success delete book with id ${id}`)
}));

module.exports = router;