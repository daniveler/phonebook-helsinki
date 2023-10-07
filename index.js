const express = require('express')
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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})