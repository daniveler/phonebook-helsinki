require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')
const errors = require('./handlers/errors')

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

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    response.locals.id = id

    Person.findById(id)
        .then(person => {
            if (!person) {
                throw new Error('idNotFound')
            }
            else {
                response.json(person).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name) {
        return response.status(400).json({ error: 'name field is mandatory' })
    }
    else if (!person.phoneNumber) {
        return response.status(400).json({ error: 'phoneNumber field is mandatory' })
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

app.delete('/api/persons/:id', (request, response, next) => {
    const idToDelete = request.params.id
    response.locals.id = idToDelete

    Person.findByIdAndDelete(idToDelete)
        .then(person => {
            if (!person) {
                throw new Error('idNotFound')
            }
            else {
                response.status(204).end()
            }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    response.locals.id = id

    const newPerson = {
        name: request.body.name,
        phoneNumber: request.body.phoneNumber
    }

    Person.findByIdAndUpdate(id, newPerson, { new: true })
        .then(updatedPerson => {
            return response.status(201).json(updatedPerson)
        })
        .catch(error => next(error))
})

app.use(errors.malformattedId)
app.use(errors.idNotFound)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})