const axios = require('axios')

const MICROSERVICE1_URL = process.env.MICROSERVICE1_URL || 'http://localhost:3000'

exports.registerUser = async (req, res) => {
    try {
        const response = await axios.post(`${MICROSERVICE1_URL}/api/auth/register`, req.body)
        res.status(response.status).json(response.data)
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const response = await axios.post(`${MICROSERVICE1_URL}/api/auth/login`, req.body)
        res.status(response.status).json(response.data)
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message })
    }
}

exports.getUserProfile = async (req, res) => {
    try {
        const response = await axios.get(`${MICROSERVICE1_URL}/api/auth/me`, {
            headers: { Authorization: req.headers.authorization }
        })
        res.status(response.status).json(response.data)
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message })
    }
}
