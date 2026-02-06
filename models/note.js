const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// 直接從 .env 讀取，不需要在命令列輸入密碼了
const url = process.env.MONGODB_URI

if (!url) {
  console.log('Error: MONGODB_URI not found in .env file')
  process.exit(1)
}


console.log('connecting to', url)

mongoose.connect(url, { dbName: 'noteApp' })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

//定義筆記模式
const noteSchema = new mongoose.Schema({
  content: {
    type : String,    // 字串型態
    minLength: 5,     // 至少5字元
    required:true     // 必填
  },
  important: Boolean,
})

//清理 _id 和 __v設定
//這個 toJSON 的設定只是一個 「顯示層」的轉換，它不會改變儲存在 MongoDB 裡的原始資料。
//資料庫裡：依然保存著 _id (ObjectId 物件) 和 __v。
//API 回傳時：當你的程式執行 response.json(note) 時，Mongoose 會自動執行這個 toJSON 轉換，即時把 _id 轉成字串 id，並隱藏 _id 和 __v 給前端看。
//所以，舊資料和新資料都會自動套用這個規則，前端拿到的格式會是統一且乾淨的。
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
