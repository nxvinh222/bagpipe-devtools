import axios from 'axios';
import env from './env';

export default axios.create({
  baseURL: env.CRAWL_SVC_URL,
  withCredentials: true,
});
