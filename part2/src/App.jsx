import { useState, useEffect } from 'react'
import axios from 'axios'
import phoneBookService from './services/phoneBook.js'
import './index.css'

const DeleteButton = ({ onClick, id, object }) => {
  //console.log(id, object)
  return (
    <button onClick = {onClick(id, object)}>delete</button>
  )
}

const DisplayNumbers = ({ persons, onClick }) => {
  return (
    <div>
      <h2>Numbers</h2>
      {persons.map((person, index) => {
        return (
          <li key = {person.id}>
            {person.name} {person.number} <DeleteButton onClick = {onClick} id = {person.id} object = {person}/>
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

const AddedNotification = ({ name }) => {
  if (name != null) {
    return (
      <div className = "added">
        Added {name} 
      </div>
    )
  }
}

const UpdateErrorNotification = ({ name }) => {
  if (name != null) {
    return (
      <div className = "error">
        Information of {name} has already been removed from server
      </div>
    )
  }
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [addedName, setAddedName] = useState(null)
  const [updateError, setUpdateError] = useState(null)

  useEffect(() => {
    //console.log('effect')
    phoneBookService
      .getAll()
      .then(initialData => {
        setPersons(initialData)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    //console.log(newName)
    if (newName != '' && newNumber != '') {
      const nameObject = { name: newName, number: newNumber }
      const found = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase())
      //console.log('found', found)
      if (found === undefined) {
        phoneBookService
          .create(nameObject)
          .then(returnedValue => {
            setPersons(persons.concat(returnedValue))
            setAddedName(newName)
            setTimeout(() => {
              setAddedName(null)
            }, 5000)
          })
      } else {
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          phoneBookService
            .update(found.id, nameObject)
            .then(updatedData => {
              console.log(updatedData)
              setPersons(persons.map(person => person.id === updatedData.id ? updatedData : person))
            })
            .catch(error => {
              //console.log(error)
              setUpdateError(newName)
              setTimeout(() => {
                setUpdateError(null)
                setPersons(persons.filter(person => person.name != newName))
              }, 5000)
            })
        }
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

  const deleteHandler = (id, object) => () => {
    if (window.confirm(`Delete ${object.name}?`)) {
      phoneBookService
        .remove(id, object)
        .then(removedData => {
          // console.log(removedData)
          // console.log(persons)
          setPersons(persons.filter(person => person.id != id))
        })
    }
    // console.log("clicked")
    // console.log(id)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <AddedNotification name = {addedName}/>

      <UpdateErrorNotification name = {updateError}/>
      
      <Filter filter = {filter} onChange = {handleFilterName}/>

      <h2>add a new</h2>

      <Form 
        addPerson = {addPerson}
        newName = {newName}
        newNumber = {newNumber}
        handleNameChange = {handleNameChange}
        handleNumberChange = {handleNumberChange}
      />

      <DisplayNumbers persons = {getFilteredName()} onClick = {deleteHandler}/>
    </div>
  )
}

export default App