import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_ENDPOINT,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
});

export default instance;
