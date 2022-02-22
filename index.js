const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const morgan = require('morgan')

const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan((tks, req, res) => {
  return [
    tks.method(req, res),
    tks.url(req, res),
    tks.status(req, res),
    tks.res(req, res, 'content-length'), '-',
    tks['response-time'](req, res), 'ms'
  ].join(' ')
}))


app.get('/', (req, res) => {
  res.send('<h1>Fullstack, osa 3</h1>')
})

//Toimii tietokannan kanssa
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

//Toimii tietokannan kanssa
app.get('/info', (req, res) => {
  const date = new Date()
  Person.find({}).then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
  })
})

//Toimii tietokannan kanssa
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//Toimii tietokannan kanssa
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(response.status(204).end())
    .catch(error => next(error))
})

//Toimii tietokannan kanssa
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ ERROR: 'Malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})