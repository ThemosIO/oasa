import axios from 'axios';

const api = axios.create({
  baseURL: 'http://telematics.oasa.gr/api',
  timeout: 15000,
  transformRequest: [data => JSON.stringify(data)],
  mode: 'no-cors',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
});

export const GET_CLOSEST_STOPS = ({ lat, lon }) => lat && lon &&
  api.post(`/?act=getClosestStops&p1=${lat}&p2=${lon}`);
