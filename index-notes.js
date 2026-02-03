const express = require('express')
const app = express()

//跨域請求設定
const cors = require('cors');

app.use(cors()); // 自動加上 Access-Control-Allow-Origin: *

app.use(express.json())

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  },
  {
    id: "4",
    content: "亂七八糟的東西",
    important: true
  }
] 

// === 設定路由 ===

//訪問根目錄請求
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//訪問api/notes請求
app.get('/api/notes', (request, response) => {
  response.json(notes)
})

//訪問文章id請求
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.send('<h1>文章不存在!</h1>')
  }
})

//根據id修改文章請求
app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const body = request.body
  const oldNote = notes.find(n=>n.id===id)
  const newNote = { ...oldNote, important: body.important}
    
  notes = notes.map(note => note.id === id ? newNote : note)

  response.json(newNote)
})

//根據id刪除文章請求
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.send('<h1>文章已刪除!</h1>')
})

//設定產生文章ID
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}
//設定請求新增筆記
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) { //設定空白內容警告
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false, //預設false
    id: generateId(), //引入ID產生器
  }

  notes = notes.concat(note) 

  response.json(note)
})


// === 啟動伺服器 ===

const PORT = 2999
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})