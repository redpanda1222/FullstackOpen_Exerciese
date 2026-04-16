const express = require('express')
const app = express()
const cors = require('cors');
var morgan = require('morgan')

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

let persons = [
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
];

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

morgan.token('body', (req) => JSON.stringify(req.body))

//app.use(requestLogger);

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
  response.send('<h1>Hello World! My name is Panda!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    const note = notes.find(note => note.id === id);
    
    if (note) {
        response.json(note);
    } else {
        response.status(404).end()
    }
    
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

/* 
  get all the data of persons {json}
*/
app.get('/api/persons', (request, response) => {
  response.json(persons);
})

/* 
  get persons info {text/html}
*/
app.get('/api/persons/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
                 <p>${new Date()}</p>`)
})

/* 
  get specific person info by using id {json}
*/
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
})

/*
  delete specific person fron persons data {}
*/
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter(person => person.id !== id);

  response.status(204).end()
})

const generatePersonId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

/*
  create new person and added to persons data if data is valid
*/
app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body) {
    return response.status(400).json({
      error: "content is missing"
    })
  }

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "one of the content is missing"
    })
  }

  const newPerson = {
    id: generatePersonId(),
    name: body.name,
    number: body.number
  }

  const search = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase());

  if (search) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }

  persons = persons.concat(newPerson);
  //console.log(persons);

  response.json(newPerson);
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})