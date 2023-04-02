const axios = require('axios')

const axiosInstance = axios.create({
  headers: {
    Authorization: ` `,
    'content-type': 'application/json',
  }
})

module.exports = { _http: axiosInstance }