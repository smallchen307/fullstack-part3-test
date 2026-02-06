require('dotenv').config() // 必須在引入 Note 模型之前
const express = require('express')
const app = express()
const Note = require('./models/note')

const cors = require('cors'); // 跨域請求設定
app.use(cors());              // 自動加上 Access-Control-Allow-Origin: *
app.use(express.json())       // 中介軟體 解析JSON

// === 設定路由 ===

//訪問根目錄請求
app.get('/', (request,response) => {
  response.send('<h1>Hello World!</h1>')
})

//訪問api/notes請求
app.get('/api/notes', (request,response,next) => {
  Note.find({})
  .then(notes => {
    response.json(notes)
  })
  .catch(error => next(error))
  })

//訪問api/notes/id請求
app.get('/api/notes/:id', (request,response,next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//根據id修改文章的重要與否 請求
app.put('/api/notes/:id', (request,response,next) => {
  const body = request.body
  const newNote = { content: body.content, important: body.important }

  Note.findByIdAndUpdate(request.params.id,newNote,{ new: true, runValidators: true})
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))

})

// 根據id刪除文章請求
app.delete('/api/notes/:id', (request,response,next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result=>{
      response.status(204).end()
    })
    .catch(error => next(error))
})

// 設定請求新增筆記
app.post('/api/notes', (request,response,next) => {
  const body = request.body

  if (!body.content) { //設定空白內容警告
    return response.status(400).json({error: 'content missing'})
  }

  const newNote = new Note({
    content: body.content,
    important: body.important || false,
  })

  newNote.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

//錯誤處理中介
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

// === 啟動伺服器 ===
const PORT = process.env.PORT || 2999
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})