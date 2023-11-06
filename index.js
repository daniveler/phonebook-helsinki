require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(bodyParser.json());

const morganMiddleware = ((request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Request body:  ', request.body)
    console.log('Time:  ', new Date().toISOString())
    console.log('---')
    next()
})

app.use(morganMiddleware)

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person.findById(id)
        .then(person => {
            if (!person) {
                response.status(404).json({ error: `Person with id: ${id} was not found` })
            }
            else {
                response.json(person).end()
            }
        })
})

app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name) {
        return response.status(400).json({ error: '\"name\" field is mandatory' })
    }
    else if (!person.phoneNumber) {
        return response.status(400).json({ error: '\"phoneNumber\" field is mandatory' })
    }
    else {
        const newPerson = new Person({
            id: person.id,
            name: person.name,
            phoneNumber: person.phoneNumber
        })

        newPerson.save().then(savedPerson => {
            response.status(201).end()
        })
    } 
})

app.delete('/api/persons/:id', (request, response) => {
    const idToDelete = request.params.id

    Person.findByIdAndDelete(idToDelete)
        .then(response.status(204).end())
        .catch(error => response.status(404).json({ error: `Person with id: ${idToDelete} could not be deleted` }))
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})