require('dotenv').config()

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./loggerMiddleware')

const connectDB = require('./mongo.js')
const Note = require('./models/Note.js')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

connectDB()

app.use(cors())
app.use(express.json())
app.use('/images', express.static('images'))

Sentry.init({
  dsn: 'https://c569d9146a714380bde974690816db72@o1385380.ingest.sentry.io/6705203',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

// Middlewares, funciones que se ejecutan/interceptan las peticiones hechas a una API
app.use(logger)

app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.get('/', (request, response) => {
  response.send('<h1>Hiii uwu</h1>')
})

app.get('/api/notes', (request, response, next) => {
  Note.find({})
    .then(notes => response.json(notes))
    .catch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  Note.findById(id).then(note => {
    if (note) {
      return response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  const note = request.body

  const infoToUpdate = {
    title: note.title,
    important: note.important
  }

  Note.findByIdAndUpdate(id, infoToUpdate, { new: true })
    .then(result => response.json(result))
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findByIdAndRemove(id)
    .then(response.status(204).end())
    .catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
  const note = request.body

  if (!note.title) {
    return response.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note({
    title: note.title,
    important: true,
    date: new Date().toISOString()
  })

  newNote.save()
    .then(response.json(newNote))
    .catch(error => next(error))
})

app.use(notFound)

app.use(Sentry.Handlers.errorHandler())

app.use(handleErrors)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
