import axios from 'axios';

const api = axios.create({
  baseURL: 'https://telematics.oasa.gr/api',
  timeout: 10000,
  withCredentials: true,
  transformRequest: [data => JSON.stringify(data)],
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
});

export const GET_CLOSEST_STOPS = ({ lat, lon }) => lat && lon &&
  api.get(`/?act=getClosestStops&p1=${lat}&p2=${lon}`);
