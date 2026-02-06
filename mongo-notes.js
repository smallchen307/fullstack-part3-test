require('dotenv').config() //  dotenv是一個可協助你設定環境變數的npm套件，從.env讀取URL
const mongoose = require('mongoose')

// 直接從 .env 讀取，不需要在命令列輸入密碼了
const url = process.env.MONGODB_URI 

if (!url) {
  console.log('Error: MONGODB_URI not found in .env file')
  process.exit(1)
}

mongoose.set('strictQuery', false)
mongoose.connect(url)

// 配合 notes 練習，定義了筆記模式
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

//定義筆記模型
const Note = mongoose.model('Note', noteSchema)

//借助Note 模型新建一筆資料內容
const note = new Note({
  content: 'HTML is easy',
  important: true,
})


// 執行儲存
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})

/*
//借助Note模型的find方法  執行查詢
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
*/