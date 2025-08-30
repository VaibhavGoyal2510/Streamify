// Everytime if we want to send request to our backend we will have to write "http://localhost:5001/api/..." again & again 
// So we write this to prevent repetion 

import axios from "axios";

const BASE_URL = import.meta.env.MODE ==="development"?"http://localhost:5001/api":"/api"

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true , // send cookies with request
})