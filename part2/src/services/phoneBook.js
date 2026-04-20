import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = async () => {
    const request = axios.get(baseUrl)
    const response = await request
    return response.data
}

const create = (newObject) => {
    
    return axios.post(baseUrl, newObject).then(response => response.data)
}

const update = async (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    const response = await request
    return response.data
}

const remove = async (id, object) => {
    const request = axios.delete(`${baseUrl}/${id}`, object)
    const response = await request
    return response.data
}
export default { getAll, create, update, remove }