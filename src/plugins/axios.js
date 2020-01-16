import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 3000 // prevent "Liefy" to wait 30sec until the request timed out
});

instance.defaults.headers.post['Content-Type'] =
  'application/json;charset=UTF-8';

export default instance;
