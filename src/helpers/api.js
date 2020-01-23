import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // proxied through netlify.toml
  timeout: 15000,
  transformRequest: [data => JSON.stringify(data)],
  headers: { 'Access-Control-Allow-Origin': '*' }
});

export const GET_CLOSEST_STOPS = ({ lat, lon }) => lat && lon &&
  api.post(`/?act=getClosestStops&p1=${lat}&p2=${lon}`);
