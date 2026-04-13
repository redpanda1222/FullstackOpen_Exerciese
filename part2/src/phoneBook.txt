import { useState } from 'react'

const DisplayNumbers = ({ persons }) => {
  return (
    <div>
      <h2>Numbers</h2>
      {persons.map((person, index) => {
        return (
          <li key = {index}>
            {person.name} {person.number}
          </li>
        )
      })}
    </div>
  )
}

const Filter = ({ filter, onChange }) => {
  return (
    <div>
      filter shown with <input 
        value = {filter}
        onChange = {onChange}
      />
    </div>
  )
}

const Form = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
    <form onSubmit = {addPerson}>
        <div>
          name: <input 
            value = {newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          number: <input 
            value = {newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    //console.log(newName)
    if (newName != '' && newNumber != '') {
      const nameObject = { name: newName, number: newNumber, id: persons.length + 1}
      const found = persons.find((person) => person.name === newName)
      //console.log('found', found)
      if (found === undefined) {
        setPersons(persons.concat(nameObject))
      } else {
        alert(newName + ' is already added to phonebook')
      }
    } else {
      alert('Nothing is added')
    }
    setNewName('')
    setNewNumber('')
    //console.log(persons)
  }

  const handleNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterName = (event) => {
    setFilter(event.target.value)

  }

  const getFilteredName = () => {
    if (filter === '') {
      return (
        persons
      )
    }
    const filteredArr = persons.filter(person => {
        return (
          person.name.length >= filter.length && 
          person.name.substring(0, filter.length).toLowerCase() === filter.toLowerCase()
        )
      })
    return (
      filteredArr
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter filter = {filter} onChange = {handleFilterName}/>

      <h2>add a new</h2>

      <Form 
        addPerson = {addPerson}
        newName = {newName}
        newNumber = {newNumber}
        handleNameChange = {handleNameChange}
        handleNumberChange = {handleNumberChange}
      />

      <DisplayNumbers persons = {getFilteredName()}/>
    </div>
  )
}

export default App