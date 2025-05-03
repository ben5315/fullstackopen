import axios from "axios";

const getAll = () => {
    return axios.get('http://localhost:3001/persons')
        .then(response => response.data)
}

const addPerson = ({ name, number }) => {
    return axios.post('http://localhost:3001/persons', { name, number })
        .then(response => response.data)
}

const deletePerson = (id) => {
    return axios.delete(`http://localhost:3001/persons/${id}`)
    .then(response => response.data)
}

const updatePerson = (person, newNumber) => {
    return axios.put(`http://localhost:3001/persons/${person.id}`, { id: person.id, name: person.name, number: newNumber})
    .then(response => response.data)
}

export default { getAll, addPerson, deletePerson, updatePerson}