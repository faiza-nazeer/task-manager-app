import axios from '../axiosConfig';


const API = 'http://localhost:5000/notifications'; // Update if deployed

export const fetchNotifications = () => axios.get(API);

