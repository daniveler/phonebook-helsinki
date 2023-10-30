require ('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');
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
                response.status(404).json( {error: `Person with id: ${id} was not found`})
            }
            else {
                response.json(person).end()
            }
        })
})

app.get('/info', (request, response) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    const formattedDate = `${day}-${month}-${year}`;

    response.json({
        count: persons.length,
        date: formattedDate
    })
})


app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name) { 
        return response.status(400).json({ error: '"name" field is mandatory'})
    }
    else if (!person.phone) {
        return response.status(400).json({ error: '"phone" field is mandatory'})
    }
    else if (persons.find(p => p.name === person.name)) {
        return response.status(400).json({ error: `name: ${person.name} is alredy saved in the phonebook`})
    }

    persons = persons.concat(person)

    response.status(201).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const idToDelete = parseInt(request.params.id)

    const indexToDelete = persons.findIndex(person => person.id === idToDelete)

    if (indexToDelete !== -1) {
        persons.splice(indexToDelete, 1)
        response.status(204).end()
    }
    else {
        return response.status(404).json({ error: `Person with id: ${idToDelete} could not be deleted`})
    }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})