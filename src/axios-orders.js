import axios from 'axios';

const instance = axios.create({
    baseURL:'https://react-kay-burger-builder-default-rtdb.firebaseio.com/'
});

export default instance;