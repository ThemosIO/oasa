import axios from 'axios';

const api = axios.create({
  baseURL: 'http://telematics.oasa.gr/api', // http because oasa's certificate not accepted
  timeout: 5000,
  transformRequest: [data => JSON.stringify(data)],
  mode: 'no-cors',
  headers: {
    'Access-Control-Allow-Origin': '*',
  }
});

export const GET_CLOSEST_STOPS = ({ lat, lon }) => lat && lon &&
  api.post(`/?act=getClosestStops&p1=${lat}&p2=${lon}`);
