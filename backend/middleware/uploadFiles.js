const multer = require('multer')
const path = require('path')

// 1つの storage 設定にまとめる
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'audioFile') {
      cb(null, 'uploads/audio/')
    } else if (file.fieldname === 'imageFile') {
      cb(null, 'uploads/image/')
    } else if (file.fieldname === 'icon') {
      cb(null, 'uploads/icon/')
    } else {
      cb(new Error('Invalid field name'), false)
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now()
    if (file.fieldname === 'audioFile') {
      cb(null, `${timestamp}-audio${path.extname(file.originalname)}`)
    } else if (file.fieldname === 'imageFile') {
      cb(null, `${timestamp}-image${path.extname(file.originalname)}`)
    }else if (file.fieldname === 'icon') {
      cb(null, `${timestamp}-icon${path.extname(file.originalname)}`)
    }
  }
})

// fileFilterも1つにまとめる
const fileFilter = (req, file, cb) => {
  console.log('file received:', file)
  if (
    file.fieldname === 'audioFile' &&
    file.mimetype === 'audio/mpeg'
  ) {
    return cb(null, true)
  }

  if (
    file.fieldname === 'imageFile' &&
    ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)
  ) {
    return cb(null, true)
  }

  if (
    file.fieldname === 'icon' &&
    ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)
  ) {
    console.log('file.fieldname === icon')
    return cb(null, true)
  }

  cb(new Error(`Invalid file type for field "${file.fieldname}"`), false)
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 全体で最大10MBまで（必要なら調整OK）
})

module.exports = { upload }