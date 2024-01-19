import axios from "axios";

export const discordHTTP = axios.create({baseURL: "http://localhost:3100"});