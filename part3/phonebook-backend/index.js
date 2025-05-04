const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let people = [
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
    }
]

app.get('/', (req, res) => {
    res.status(200).end()
})

app.get('/api/persons', (req, res) => {
    res.json(people)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = people.find(p => p.id === id)

    if (!person) {
        res.status(404).end()
    } else {
        res.json(person)
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    people = people.filter(p => p.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({error: 'Missing name'})
    } else if (!body.number) {
        return res.status(400).json({error: 'Missing number'})
    } else if (people.some(p => p.name === body.name)) {
        return res.status(400).json({error: `${body.name} already exists in the phonebook`})
    }

    const person = {
        // id: String(Math.max(...people.map(p => Number(p.id))) + 1),
        id: String(Math.floor(Math.random()*1000)),
        name: body.name,
        number: body.number
    }

    people = people.concat(person)
    res.json(person)
})

app.get('/info', (req, res) => {
    res.send(`<p>The phonebook has info for ${people.length} people.</p><br/><p>${Date()}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})