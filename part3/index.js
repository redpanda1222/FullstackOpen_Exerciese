
const express = require('express')
const app = express()
const cors = require('cors');
var morgan = require('morgan')

app.use(express.static('dist'))
app.use(cors());
app.use(express.json());

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

const Person = require('./models/person')

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


app.get('/', (request, response) => {
  response.send('<h1>Hello World! My name is Panda!</h1>')
})

app.get('/:api/notes', (request, response) => {
  const api = request.params.api;
  console.log(api);
  if (api !== "1594") return response.status(401).end()
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
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(result => {
      response.json(result);
      console.log("phonebook:")
      result.forEach(person => {
          console.log(person.name, person.number)
      })
  })
  .catch(error => next(error))
})

/* 
  get persons info {text/html}
*/
app.get('/api/persons/info', (request, response, next) => {
  Person.find({}).then(result => {
    response.send(`<p>Phonebook has info for ${result.length} people</p>
                 <p>${new Date()}</p>`)
  })
  .catch(error => next(error));
  
})

/* 
  get specific person info by using id {json}
*/
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  // const person = persons.find(person => person.id === id);
  // if (person) {
  //   response.json(person);
  // } else {
  //   response.status(404).end();
  // }
  Person.findById(id).then(person => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  })
  .catch(error => {
    next(error);
  })
})

/*
  delete specific person fron persons data {}
*/
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
})

/*
  create new person and added to persons data if data is valid
*/
app.post('/api/persons', (request, response, next) => {
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

  const newPerson = new Person({
    name: body.name,
    number: body.number
  })

  // const search = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase());

  // if (search) {
  //   return response.status(400).json({
  //     error: "name must be unique"
  //   })
  // }

  newPerson.save().then(savedNote => {
    console.log("saved newPerson");
    console.log(savedNote);
    response.json(savedNote);
  })
  .catch(e => {
    next(e);
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  const id = request.params.id;

  if (!body) return response.status(400).json({ error: "content is missing"})

  if (!body.name || !body.number) return response.status(400).json({ error: "number is missing" })

  Person.findById(id).then(p => {
    if (!p) {
      return response.status(404).end();
    }

    p.name = body.name;
    p.number = body.number;

    return p.save().then(result => {
      response.json(p);
    })
  })
  .catch(error => next(error));
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name == 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ];

/*
const generatePersonId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}
  */