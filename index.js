require('dotenv').config()
const express = require('express')
const morgan = require('morgan');
const app = express() // 創建 Express 應用程式
const Person = require('./models/persons') // 引入 Person 模型
const cors = require('cors'); // 跨域請求設定

app.use(cors());              // 自動加上 Access-Control-Allow-Origin: *
app.use(express.json());      // 中介軟體 解析JSON

app.use(morgan('dev')); // 中介軟體 紀錄日誌

// 自定義 morgan token 來記錄請求體
morgan.token('body', (req) => JSON.stringify(req.body)); // 將請求體轉換為 JSON 字串

// 使用自定義的 morgan 格式
app.use(morgan(':method :url :status :response-time ms - :body')); 




// === 設定路由 ===

//訪問根目錄請求
app.get('/', (request, response) => {
  response.send('<h1>Hello World!123</h1>')
})

//  訪問api/persons請求
app.get('/api/persons', (request, response,next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

// 訪問info目錄請求
app.get('/info', (request, response,next) => {
  Person.countDocuments({})
  .then(count => {
    const currentTime = new Date();
    const infoHtml = `<p>Phonebook has info for ${count} people</p><p>${currentTime}</p>`;
    response.send(infoHtml);
  })
  .catch(error => next(error))
})

// 訪問人物id請求
app.get('/api/persons/:id', (request, response,next) => {
  Person.findById(request.params.id)
    .then(person=>{
      if(person) {
        response.json(person)
      }else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))

})

// 根據id修改人物請求
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).json({ error: '找不到聯絡人' })
      }
    })
    .catch(error => next(error))
})

// 根據id刪除人物請求
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// 3.5 設定請求新增名單
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // 3.6 設定空白內容警告
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        // 如果姓名已存在，則更新號碼
        const personToUpdate = { number: body.number }
        Person.findByIdAndUpdate(existingPerson.id, personToUpdate, { new: true, runValidators: true, context: 'query' })
          .then(updatedPerson => response.json(updatedPerson))
          .catch(error => next(error))
      } else {
        // 如果姓名不存在，則新增聯絡人
        const newPerson = new Person({ name: body.name, number: body.number })
        newPerson.save()
          .then(savedPerson => response.json(savedPerson))
          .catch(error => next(error))
      }
    })
    .catch(error => next(error))
})


//錯誤處理中介
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  // 新增：處理 Mongoose 驗證錯誤
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// === 啟動伺服器 ===

const PORT = 2999
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})