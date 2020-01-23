import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // proxied through netlify.toml
  timeout: 5000,
  headers: { 'Access-Control-Allow-Origin': '*' },
});

export const GET_CLOSEST_STOPS = ({ lat, lon }) => lat && lon &&
  api.get(`/?act=getClosestStops&p1=${lat}&p2=${lon}`);
