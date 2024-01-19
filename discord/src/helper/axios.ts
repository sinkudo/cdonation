import axios from "axios";

export const serverHTTP = axios.create({baseURL: "http://localhost:3000"});