const rateLimit = require('express-rate-limit')

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 各IPが15分ごとに最大100リクエスト
  message: { message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true, // RateLimit-* headers を有効にする
  legacyHeaders: false,  // X-RateLimit-* headers を無効にする
})

module.exports = { apiLimiter }
