require('dotenv').config() //  dotenv是一個可協助你設定環境變數的npm套件，從.env讀取URL
const mongoose = require('mongoose')

// 直接從 .env 讀取，不需要在命令列輸入密碼了
const url = process.env.MONGODB_URI 

if (!url) {
  console.log('Error: MONGODB_URI not found in .env file')
  process.exit(1)
}

mongoose.set('strictQuery', false) // 關閉嚴格查詢模式警告
mongoose.connect(url,{dbName:'phonebook'}) // [Mongoose] 建立資料庫連線

// 定義模式 (Schema) - 這是 Mongoose 獨有的功能，MongoDB 原生是沒有 Schema 的
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  // id: Number, // MongoDB 會自動生成 _id 屬性，所以不需要手動定義 id
})

//定義模型 (Mongoose 會自動將單數 'Person' 轉為複數小寫 'people' 作為集合名稱)
// Person (大寫) 是「模型」，代表整個 people 集合。它是用來操作資料庫的工具。
const Person = mongoose.model('Person', personSchema)

//定義命令傳進來的參數 (排除前兩個預設參數 node 和 檔案路徑)
const args = process.argv.slice(2)

//依據參數長度 不同處理
if(args.length===2){
  // 情況一：如果參數有兩個 (姓名, 電話)，執行新增資料
  const [name,number] = args // 陣列解構
  // person (小寫) 是「實例」，代表即將存入的一筆具體資料
  const person = new Person({ name, number })
  
  person.save() // [Mongoose] .save() 是 Mongoose 提供的方法，用來將這個 JS 物件寫入資料庫
    .then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close() // 完成後關閉連線
    })
}else {
  // 情況二：如果沒有參數，執行查詢所有資料
  Person.find({}) // [Mongoose] .find() 是 Mongoose 模型的方法，用來搜尋資料
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close() // 查詢完成後關閉連線
    })
}
