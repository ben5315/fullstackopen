import { useState, useEffect } from 'react'
import axios from 'axios'
import peopleService from './services/people'

const Filter = ({ searchValue, onChange }) => {
  return (
    <div>
      Search by name: <input value={searchValue} onChange={onChange}></input>
    </div>
  )
}

const AddPerson = ({ nameValue, onNameChange, numberValue, onNumberChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={nameValue} onChange={onNameChange} />
      </div>
      <div>
        phonenumber: <input value={numberValue} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const People = ({ peopleToShow, deletePerson }) => {
  return (
    <>
      {peopleToShow.map(person => <Person key={person.id} person={person} deletePerson={deletePerson} />)}
    </>
  )
}


const Person = ({ person, deletePerson }) => {
  return (
    <>
      <p>{person.name} - {person.number}</p>
      <button onClick={() => deletePerson(person)}>Delete</button>
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  const enterName = (event) => {
    setNewName(event.target.value)
  }

  const enterNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const updateSearch = (event) => {
    setSearch(event.target.value)
  }

  const submitName = (event) => {
    if (persons.some(person => person.name === newName)) {
      // alert(`${newName} is already in the phonebook!`)
      let person = persons.find(p => p.name === newName)
      updatePerson(person)
    } else {
      peopleService
        .addPerson({ name: newName, number: newNumber })
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
        })
        .catch(error => {
          console.log('Failed to save new user to phonebook')
        })
    }
    event.preventDefault()
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (person) => {
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      peopleService.deletePerson(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
  }

  const updatePerson = (person) => {
    if (window.confirm(`${person.name} is already in the phonebook, would you like to update their number?`)) {
      peopleService.updatePerson(person, newNumber)
        .then(newPerson => {
          setPersons(persons.map(p => p.id !== person.id ? p : newPerson))
        })
    }
  }

  const peopleToShow = persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    peopleService
      .getAll()
      .then(people => {
        setPersons(people)
      })
      .catch(error => {
        console.log('Failed to load data from server');
        console.log(error);
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchValue={search} onChange={updateSearch} />
      <h2>Add a new person</h2>
      <AddPerson nameValue={newName} onNameChange={enterName} numberValue={newNumber} onNumberChange={enterNumber} onSubmit={submitName} />
      <h2>Numbers</h2>
      <People peopleToShow={peopleToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App