import axios from 'axios';
import { getBaseUrl } from '../utils/redirec';

// Invoca a função dinamicamente
const baseUrlDinamica = getBaseUrl();

const api = axios.create({
  baseURL: baseUrlDinamica,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json'
  }
});

console.log("Axios conectando dinamicamente em:", baseUrlDinamica);

export default api;

// import axios from 'axios';

// const baseUrlFromEnv = process.env.REACT_APP_LOCAL_BASE_URL?.trim();

// const api = axios.create({
//   baseURL: baseUrlFromEnv,
//   withCredentials: true, 
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// console.log("Conectando em:", baseUrlFromEnv);

// export default api;