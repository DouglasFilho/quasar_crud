const axios = require('axios')

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer sua_api_key`,
    'content-type': 'application/json',
  }
})

module.exports = { _http: axiosInstance }