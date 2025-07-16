const multer = require('multer')
const path = require('path')

// 許可された拡張子とMIMEタイプ
const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'webp']
const ALLOWED_AUDIO_TYPES = ['mp3']

// 拡張子チェック用
const getExtension = (filename) => {
  return path.extname(filename).toLowerCase().replace('.', '')
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'audioFile') {
      cb(null, 'uploads/audio/')
    } else if (file.fieldname === 'imageFile') {
      cb(null, 'uploads/image/')
    } else if (file.fieldname === 'icon') {
      cb(null, 'uploads/icon/')
    } else if (file.fieldname === 'coverImage') {
      cb(null, 'uploads/coverImage/')
    } else {
      cb(new Error('Invalid field name'), false)
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now()
    const ext = path.extname(file.originalname)
    cb(null, `${timestamp}-${file.fieldname}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  const ext = getExtension(file.originalname)
  const mimetype = file.mimetype

  if (file.fieldname === 'audioFile') {
    if (mimetype === 'audio/mpeg' && ALLOWED_AUDIO_TYPES.includes(ext)) {
      return cb(null, true)
    }
  }

  if (
    ['imageFile', 'icon', 'coverImage'].includes(file.fieldname) &&
    mimetype.startsWith('image/') &&
    ALLOWED_IMAGE_TYPES.includes(ext)
  ) {
    return cb(null, true)
  }

  cb(new Error(`Invalid file type or extension for field "${file.fieldname}"`), false)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 最大10MB
  }
})

module.exports = { upload }
