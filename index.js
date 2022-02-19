const express = require('express')
const app = express()

app.use(express.json())

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

const contactAmt  = (persons.length)
const currentTime = new Date()

const generateId = () => {
    const topId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return Math.floor(Math.random() * (100 - topId) + topId)
}


app.get('/', (req, res) => {
    res.send('<h1>Fullstack, osa 3</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
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

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'Name or number missing' 
        })
    }

    if (persons.some(p => p.name === body.name)) {
        return response.status(400).json({ 
            error: 'Name must be unique' 
          })
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)

    console.log(newPerson)
    response.json(newPerson)
})


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)