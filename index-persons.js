const express = require('express')
const morgan = require('morgan');
const app = express()

//跨域請求設定
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

// 中介軟體
app.use(express.json());   //解析 JSON

// 使用 morgan 中間件 
app.use(morgan('dev'));  //日誌

// 自定義 morgan token 來記錄請求體
morgan.token('body', (req) => JSON.stringify(req.body)); // 將請求體轉換為 JSON 字串

// 使用自定義的 morgan 格式
app.use(morgan(':method :url :status :response-time ms - :body')); 



let persons =[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
      "id": "5",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
      "id": "6",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
      "id": "7",
      "name": "sss", 
      "number": "123456"
    }
  ]


// === 設定路由 ===

//訪問根目錄請求
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// 3.1 訪問api/persons請求
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// 3.2 訪問info目錄請求
app.get('/info', (request, response) => {
  const numberOfPeople = persons.length;
  const currentTime = new Date();
  const infoHtml = `<p>Phonebook has info for ${numberOfPeople} people</p><p>${currentTime}</p>`;
  response.send(infoHtml);
})

// 3.3 訪問文章id請求
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.send('<h1>文章不存在!</h1>')
  }
})

//根據id修改人物請求
app.put('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const body = request.body
  const oldNumber = persons.find(p=>p.id===id)
  if (!oldNumber) {
  return response.status(404).json({ error: '找不到聯絡人' });
  }
  const newNumber = { ...oldNumber, number: body.number?? oldNumber.number} //防呆 沒傳number就用舊的
    
  persons = persons.map(person => person.id === id ? newNumber : person)

  response.json(newNumber)
})

// 3.4 根據id刪除人物請求
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

// 3.5 設定產生文章ID
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => Number(p.id)))
    : 0
  return String(maxId + 1)
}
// 3.5 設定請求新增筆記
app.post('/api/persons', (request, response) => {
  const body = request.body
  
  // 3.6 設定空白內容警告
  if (!body.name || !body.number) { 
    return response.status(400).json({
      error: 'content missing'
    })
  }
  // 3.6 設定名稱重複警告
  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: body.id
  }

  persons = persons.concat(newPerson) 

  response.json(newPerson)
})


// === 啟動伺服器 ===

const PORT = 2999
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})