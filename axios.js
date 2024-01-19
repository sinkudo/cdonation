// import axios from "axios";
const axios = require('axios')

exports.discordHTTP = axios.create({baseURL: "http://localhost:3100"});