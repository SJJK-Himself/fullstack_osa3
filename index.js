require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Person = require('./models/person')


app.use(cors())
app.use(express.json())
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

let persons = [
    {
        id: 1,
        name:"Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name:"Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name:"Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name:"Mary Poppendick",
        number: "39-23-6423122"
    }
]


const generateId = () => {
    const topId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return Math.floor(Math.random() * (100 - topId) + topId)
}

const contactAmt  = (persons.length)
const currentTime = new Date()

app.get('/', (req, res) => {
    res.send('<h1>Fullstack, osa 3</h1>')
})

//Toimii tietokannan kanssa
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/info', (req, res) => {
    res.send('<p>Phonebook has info for ' + contactAmt + ' people</p>' + '<p>' + currentTime + '</p>')
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {response.json(person)}
    else {response.status(404).end()}
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

//Toimii tietokannan kanssa
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'Name or number missing' 
        })
    }
  
    const person = new Person({
        id: generateId(),
        name: body.name,
        number: body.number
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})