import { useState } from 'react'

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

const People = ({ peopleToShow }) => {
  return (
    <>
      {peopleToShow.map(person => <Person key={person.name} person={person}/>)}
    </>
  )
}

const Person = ({ person }) => {
  return (
    <p>{person.name} - {person.number}</p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
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
      alert(`${newName} is already in the phonebook!`)
    } else {
      setPersons(persons.concat({ name: newName, number: newNumber }))
    }
    event.preventDefault()
    setNewName('')
    setNewNumber('')
  }

  const peopleToShow = persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchValue={search} onChange={updateSearch} />
      <h2>Add a new person</h2>
      <AddPerson nameValue={newName} onNameChange={enterName} numberValue={newNumber} onNumberChange={enterNumber} onSubmit={submitName} />
      <h2>Numbers</h2>
      <People peopleToShow={peopleToShow}/>
    </div>
  )
}

export default App