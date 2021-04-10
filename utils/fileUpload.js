const path = require('path');

exports.uploadValidation = image => {
    let fileTypes = /jpeg|jpg|png/
    let mimetype = fileTypes.test(image.mimetype);
    let extname = fileTypes.test(path.extname(image.name).toLowerCase())

    if(!mimetype && !extname) return {
        success : false,
        result : 'File is not an image'
    }

    if(image.size > 10000000) return {
        success : false,
        result : 'Image size too big'
    }

    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1E9)
    const newFileName = `${uniquePrefix}-${image.name.replace(/ /g, "-")}`

    return {
        success : true,
        result: newFileName
    }
}