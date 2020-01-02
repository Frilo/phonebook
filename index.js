const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/', (req, res) => {
    res.send('<h2>The Phonebook</h2>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const ammount = persons.length
    res.send(`<p>The phonebook has info from ${ammount} people</p>
    <p>${new Date()}</p>`)
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) response.json(person)
    else response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

function getRandomId() {
    min = 0
    max = 2147483647
    return Math.floor(Math.random() * (max - min)) + min;
}

const infoMissing = body => body.name === "" || body.number === ""
const reapetedName = body => persons.some(person => person.name === body.name)

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (infoMissing(body)) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if (reapetedName(body)) {
        return response.status(409).json({
            error: 'name already on the server'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: getRandomId(),
    }

    persons = persons.concat(person)
    response.json(person)
})