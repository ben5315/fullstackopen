import axios from "axios";
const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl)
        .then(response => response.data)
}

const addPerson = ({ name, number }) => {
    return axios.post(baseUrl, { name, number })
        .then(response => response.data)
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
    .then(response => response.data)
}

const updatePerson = (person, newNumber) => {
    return axios.put(`${baseUrl}/${person.id}`, { id: person.id, name: person.name, number: newNumber})
    .then(response => response.data)
}

export default { getAll, addPerson, deletePerson, updatePerson}