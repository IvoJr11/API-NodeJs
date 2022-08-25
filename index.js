const express = require('express')
const app = express()

const cors = require('cors')
const logger = require('./loggerMiddleware')

app.use(cors())
app.use(express.json())

// Middlewares, funciones que se ejecutan/interceptan las peticiones hechas a una API
app.use(logger)

let notes = [
  {
    id: 1,
    title: 'uwu note',
    important: false,
    date: '2022-08-25T15:00:33.556Z'
  },
  {
    id: 2,
    title: 'uwu note',
    important: true,
    date: '2022-08-25T15:00:33.556Z'
  },
  {
    id: 3,
    title: 'uwu note',
    important: false,
    date: '2022-08-25T15:00:33.556Z'
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hiii uwu</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body
  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: true,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  response.json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not Found'
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
