const fs = require('fs')
const multer = require('multer')
const path = require('path')
const { errorResponse } = require('../utils/response')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync('uploads', { recursive: true })
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})

const MAX_FILE_SIZE = 10 * 1024 * 1024

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return cb(new Error('Poster must be an image file'))
    }

    cb(null, true)
  }
})

const singlePosterUpload = upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'posterUrl', maxCount: 1 }
])

const uploadPoster = (req, res, next) => {
  singlePosterUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return errorResponse(res, {
          message: 'Poster max size is 10MB',
          code: 422,
          data: [{ field: 'posterUrl', message: 'Poster max size is 10MB' }]
        })
      }

      return errorResponse(res, {
        message: 'Validation error',
        code: 422,
        data: [{
          field: 'posterUrl',
          message: err.code === 'LIMIT_UNEXPECTED_FILE'
            ? 'File field must be poster or posterUrl'
            : (err.message || 'Invalid upload file')
        }]
      })
    }

    if (err) {
      return errorResponse(res, {
        message: 'Validation error',
        code: 422,
        data: [{ field: 'posterUrl', message: err.message || 'Invalid upload file' }]
      })
    }

    const uploadedFile = req.files?.posterUrl?.[0] || req.files?.poster?.[0]

    if (uploadedFile) {
      req.body.posterUrl = `/uploads/${uploadedFile.filename}`
    }

    next()
  })
}

module.exports = {
  uploadPoster
}
