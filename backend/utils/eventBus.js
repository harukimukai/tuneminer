// utils/eventBus.js
const EventEmitter = require('events')

// シングルトンとして共有するEventEmitterインスタンス
class EventBus extends EventEmitter {}
const eventBus = new EventBus()

// デフォルトの最大リスナー数を増やす（警告回避）
eventBus.setMaxListeners(20)

module.exports = eventBus
