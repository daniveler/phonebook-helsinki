const express = require('express')
const bodyParser = require('body-parser');
const app = express()

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "666777888"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "678678678"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "789789789"
    },
    {
        id: 4, 
        name: "Mary Poppendick",
        number: "789789789"
    }
]

app.use(bodyParser.json());

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
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
    const person = request.body.person

    if (!person.name) { 
        return response.status(400).json({ error: '"name" field is mandatory'})
    }
    else if (!person.number) {
        return response.status(400).json({ error: '"number" field is mandatory'})
    }
    else if (persons.find(p => p.name === person.name)) {
        return response.status(400).json({ error: `name: ${person.name} is alredy saved in the phonebook`})
    }

    const id = Math.floor(Math.random() * 1000)
    person.id = id

    persons = persons.concat(person)

    response.status(201).end()
})

app.delete('/api/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})