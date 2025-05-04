require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ error: 'Missing name' })
  } else if (!body.number) {
    return res.status(400).json({ error: 'Missing number' })
  }
  // } else if (people.some(p => p.name === body.name)) {
  //     return res.status(400).json({error: `${body.name} already exists in the phonebook`})
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then(updatedPerson => {
        res.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person.find({}).then(people => {
    res.send(`<p>The phonebook has info for ${people.length} people.</p><br/><p>${Date()}</p>`)
  })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint.' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Malformed ID' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})